import { Injectable, NotFoundException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { LndService } from 'src/lnd/lnd.service';
import { Repository } from 'typeorm';
import { EdgeResponseDto } from './dtos/edge-response.dto';
import { NodeResponseDto } from './dtos/node-response.dto';
import { Channel } from './entities/channel.entity';
import { Node } from './entities/node.entity';
import { TWO_WEEKS } from './graph.constants';

type NodeT = {
  pubKey: string;
  alias: string;
  color: string;
  lastUpdate: number;
  capacity: number;
  minChannelSize: number;
  maxChannelSize: number;
  sockets: string[];
  peers: Set<NodeT>;
};

type NodeMap = Map<string, NodeT>;

@Injectable()
export class GraphService {
  private nodesMap: NodeMap;

  constructor(
    private lndService: LndService,
    @InjectRepository(Channel) private channelRepository: Repository<Channel>,
    @InjectRepository(Node) private nodeRepository: Repository<Node>,
  ) {
    this.nodesMap = new Map();

    this.nodeRepository.count().then((count) => {
      if (count === 0 || process.env.FORCE_FETCH_GRAPH === 'true') {
        this.updateGraph(true);
      }
    });

    this.updateGraphInMemory();
  }

  // every 10 minutes
  @Cron('*/10 * * * *')
  public async updateGraph(force?: boolean): Promise<void> {
    console.log('updateGraph');

    if (process.env.NODE_ENV !== 'production' && !force) {
      return;
    }

    await this.updateGraphInDB();
    await this.updateGraphInMemory();
  }

  public async updateGraphInMemory(): Promise<void> {
    console.time('updateGraphInMemory');

    const nodes = await this.nodeRepository.find();
    const channels = await this.channelRepository.find();

    nodes.forEach(({ public_key, alias, color, updated_at, sockets }) => {
      this.nodesMap.set(public_key, {
        alias,
        pubKey: public_key,
        color,
        lastUpdate: new Date(updated_at).valueOf(),
        capacity: 0,
        minChannelSize: Infinity,
        maxChannelSize: 0,
        peers: new Set<NodeT>(),
        sockets: JSON.parse(sockets),
      });
    });

    channels.forEach(({ source_public_key, target_public_key, capacity }) => {
      const node1 = this.nodesMap.get(source_public_key);
      const node2 = this.nodesMap.get(target_public_key);

      if (!node1 || !node2) {
        return;
      }

      node1.minChannelSize = capacity < node1.minChannelSize ? capacity : node1.minChannelSize;
      node1.maxChannelSize = capacity > node1.maxChannelSize ? capacity : node1.maxChannelSize;

      node1.capacity = node1.capacity + capacity;
      node2.capacity = node2.capacity + capacity;

      node1.peers.add(node2);
      node2.peers.add(node1);
    });

    console.timeEnd('updateGraphInMemory');
  }

  public async updateGraphInDB(): Promise<void> {
    const graphData = await this.lndService.fetchNetworkGraph();

    try {
      await this.nodeRepository.clear();
      await this.channelRepository.clear();
    } catch (error) {
      console.log(error);
    }

    console.time('updateGraphInDB');
    for (const node of graphData.nodes) {
      if (!node.updated_at || !node.alias || Date.now() - new Date(node.updated_at).valueOf() >= TWO_WEEKS) {
        continue;
      }

      await this.nodeRepository.save({
        alias: node.alias,
        color: node.color,
        public_key: node.public_key,
        sockets: JSON.stringify(node.sockets),
        updated_at: new Date(node.updated_at),
      });
    }

    for (const channel of graphData.channels) {
      if (!channel.updated_at || Date.now() - new Date(channel.updated_at).valueOf() >= TWO_WEEKS) {
        continue;
      }

      await this.channelRepository.save({
        capacity: channel.capacity,
        source_public_key: channel.policies[0].public_key,
        target_public_key: channel.policies[1].public_key,
        id: channel.id,
        transaction_id: channel.transaction_id,
        updated_at: new Date(channel.updated_at),
      });
    }
    console.timeEnd('updateGraphInDB');
  }

  public getNodes({ start }: { start: string }): NodeResponseDto[] {
    if (this.nodesMap.size === 0) {
      console.log('Graph is not ready yet');

      throw new NotFoundException('Graph is not ready yet.');
    }

    const nodes = this.breadthFirstTraveral({ start });

    return nodes;
  }

  public async getEdges(nodes: NodeResponseDto[]): Promise<EdgeResponseDto[]> {
    const edgeResponseDto: EdgeResponseDto[] = [];
    const rawNodes = nodes.map((node) => node.id);
    const edgeSet = new Set<string>();

    const channels = await this.channelRepository.find();

    channels.forEach(({ source_public_key, target_public_key }) => {
      if (rawNodes.includes(source_public_key) && rawNodes.includes(target_public_key)) {
        edgeSet.add(`${source_public_key}_${target_public_key}`);
      }
    });

    edgeSet.forEach((edgeString) => {
      const edge = edgeString.split('_');
      edgeResponseDto.push({ source: edge[0], target: edge[1] });
    });

    return edgeResponseDto;
  }

  private breadthFirstTraveral({ start }: { start: string }): NodeResponseDto[] {
    const startNode = this.nodesMap.get(start);

    const queue: NodeT[] = [];
    queue.push(startNode);

    const visited = new Set<string>();
    visited.add(startNode.pubKey);

    const distances = new Map<string, number>();
    distances.set(startNode.pubKey, 0);

    const response: NodeResponseDto[] = [];

    while (queue.length > 0) {
      const node = queue.shift();
      const peers = Array.from(node.peers);

      peers.forEach((peer) => {
        if (!visited.has(peer.pubKey)) {
          visited.add(peer.pubKey);

          const distance = distances.get(node.pubKey) + 1;

          distances.set(peer.pubKey, distance);

          queue.push(peer);

          const channelCount = peer.peers.size;

          response.unshift({
            alias: peer.alias || 'unknown',
            channelCount,
            id: peer.pubKey,
            distance,
            color: peer.color,
            lastUpdate: peer.lastUpdate,
            connections: 0,
            capacity: peer.capacity,
            minChannelSize: peer.minChannelSize,
            maxChannelSize: peer.maxChannelSize,
            avgChannelSize: Math.floor(peer.capacity / channelCount),
            sockets: peer.sockets,
          });
        }
      });
    }

    return response;
  }
}
