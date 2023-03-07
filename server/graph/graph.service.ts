import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelNinjaConfig } from 'server/core/config/configuration/channel-ninja.config';
import { Configuration } from 'server/core/config/configuration/configuration.enum';
import { SuggestionsConfig } from 'server/core/config/configuration/suggestions.config';
import { Repository } from 'typeorm';
import { LndService } from '../lnd/lnd.service';
import { EdgeResponseDto } from './dtos/edge-response.dto';
import { NodeResponseDto } from './dtos/node-response.dto';
import { Channel } from './entities/channel.entity';
import { Node } from './entities/node.entity';
import { UpdateChannel } from './types/update-channel.type';
import { UpdateNode } from './types/update-node.type';

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
    private configService: ConfigService,
  ) {
    this.nodesMap = new Map();

    this.init();
  }

  public async init(): Promise<void> {
    const { forceFetchGraph } = this.configService.get<ChannelNinjaConfig>(Configuration.channelNinja);
    const nodeCountInDB = await this.nodeRepository.count();

    if (nodeCountInDB === 0 || forceFetchGraph) {
      await this.updateGraphInDB();
    }

    await this.updateGraphInMemory();
    this.subscribeToGraph();
  }

  public subscribeToGraph(): void {
    const eventEmitter = this.lndService.subscribeToGraph();

    eventEmitter.addListener('channel_updated', async (values: UpdateChannel) => {
      await this.updatedChannel(values);
    });

    eventEmitter.addListener('channel_closed', async (values: { id: string }) => {
      await this.closedChannel(values);
    });

    eventEmitter.addListener('node_updated', async (values: UpdateNode) => {
      await this.updatedNode(values);
    });
  }

  @Cron('*/1 * * * *')
  public async updateGraphInMemory(): Promise<void> {
    console.log('updateGraphInMemory');
    const start = Date.now();

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

    const end = Date.now();
    console.log(`updatedGraphInMemory in ${end - start}ms`);
  }

  public async updateGraphInDB(): Promise<void> {
    console.log('updateGraphInDB');
    const start = Date.now();

    const { maxLastUpdatedDurationMS } = this.configService.get<SuggestionsConfig>(Configuration.suggestions);
    const graphData = await this.lndService.fetchNetworkGraph();

    try {
      await this.nodeRepository.clear();
      await this.channelRepository.clear();
    } catch (error) {
      console.log(error);
    }

    for (const node of graphData.nodes) {
      if (
        !node.updated_at ||
        !node.alias ||
        Date.now() - new Date(node.updated_at).valueOf() >= maxLastUpdatedDurationMS
      ) {
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
      if (!channel.updated_at || Date.now() - new Date(channel.updated_at).valueOf() >= maxLastUpdatedDurationMS) {
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

    const end = Date.now();
    console.log(`updatedGraphInDB in ${end - start}ms`);
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

  public async updatedChannel({ id, capacity, public_keys, transaction_id, updated_at }: UpdateChannel): Promise<void> {
    try {
      await this.channelRepository.save({
        id,
        capacity,
        source_public_key: public_keys[0],
        target_public_key: public_keys[1],
        transaction_id,
        updated_at: updated_at ? new Date(updated_at) : new Date(),
      });
    } catch (error) {
      console.error('Could not update channel', error);
      return;
    }

    for (const public_key of public_keys) {
      try {
        const { alias, updated_at, color, sockets, features } = await this.lndService.getNodeInfo(public_key);

        await this.updatedNode({
          alias,
          updated_at,
          color,
          public_key,
          sockets: sockets.map((socket) => socket.socket),
          features,
        });
      } catch (error) {
        console.log(`Could not find node: ${public_key}`);
      }
    }
  }

  public async closedChannel({ id }: { id: string }): Promise<void> {
    try {
      await this.channelRepository.delete(id);
    } catch (error) {
      console.error('Could not delete channel', error);
    }
  }

  public async updatedNode({ public_key, updated_at, alias, sockets, color }: UpdateNode): Promise<void> {
    const existingNode = await this.nodeRepository.findOneBy({ public_key });

    if (existingNode) {
      try {
        await this.nodeRepository.update(public_key, {
          alias,
          color,
          sockets: JSON.stringify(sockets),
          updated_at: updated_at ? new Date(updated_at) : new Date(),
        });
      } catch (error) {
        console.error('Could not update node', error);

        return;
      }
    }

    try {
      await this.nodeRepository.save({
        public_key,
        alias,
        color,
        sockets: JSON.stringify(sockets),
        updated_at: updated_at ? new Date(updated_at) : new Date(),
      });
    } catch (error) {
      console.error('Could not update node', error);
    }
  }
}
