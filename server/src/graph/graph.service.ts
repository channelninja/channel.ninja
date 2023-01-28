import { Injectable } from '@nestjs/common';
import { GetNetworkGraphResult } from 'lightning';
import { LndService } from 'src/lnd/lnd.service';
import { EdgeResponseDto } from './dtos/edge-response.dto';
import { NodeResponseDto } from './dtos/node-response.dto';

type Node = {
  pubKey: string;
  alias: string;
  color: string;
  lastUpdate: number;
  capacity: number;
  minChannelSize: number;
  maxChannelSize: number;
  peers: Set<Node>;
};

type NodeMap = Map<string, Node>;

@Injectable()
export class GraphService {
  private nodesMap: NodeMap;
  private graphData: GetNetworkGraphResult;

  constructor(private lndService: LndService) {
    this.lndService.getGraph().then((graphData) => {
      this.nodesMap = new Map();
      this.graphData = graphData;

      this.graphData.nodes.forEach(({ public_key, alias, color, updated_at }) => {
        this.nodesMap.set(public_key, {
          alias,
          pubKey: public_key,
          color,
          lastUpdate: new Date(updated_at).valueOf(),
          capacity: 0,
          minChannelSize: Infinity,
          maxChannelSize: 0,
          peers: new Set<Node>(),
        });
      });

      this.graphData.channels.forEach(({ policies, capacity }) => {
        const node1 = this.nodesMap.get(policies[0].public_key);
        const node2 = this.nodesMap.get(policies[1].public_key);

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
    });
  }

  public getNodes({ start }: { start: string }): NodeResponseDto[] {
    if (!this.graphData) {
      console.log('Graph not ready yet');

      return [];
    }

    const nodes = this.breadthFirstTraveral({ start });

    return nodes;
  }

  public getEdges(nodes: NodeResponseDto[]): EdgeResponseDto[] {
    const edgeResponseDto: EdgeResponseDto[] = [];
    const rawNodes = nodes.map((node) => node.id);
    const edgeSet = new Set<string>();

    this.graphData.channels.forEach(({ policies }) => {
      if (rawNodes.includes(policies[0].public_key) && rawNodes.includes(policies[1].public_key)) {
        edgeSet.add(`${policies[0].public_key}_${policies[1].public_key}`);
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

    const queue: Node[] = [];
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
          });
        }
      });
    }

    return response;
  }
}
