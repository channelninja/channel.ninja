import { Injectable } from '@nestjs/common';
import { GetNetworkGraphResult } from 'lightning';
import { LndService } from 'src/lnd/lnd.service';
import { EdgeResponseDto } from './dtos/edge-response.dto';
import { GraphResponseDto } from './dtos/graph-response.dto';
import { NodeResponseDto } from './dtos/node-response.dto';
import {
  MAX_CHANNELS,
  MIN_CHANNELS,
  MIN_DISTANCE,
  TWO_WEEKS,
} from './graph.constants';

type Node = {
  pubKey: string;
  alias: string;
  color: string;
  lastUpdate: number;
  partners: Set<Node>;
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

      this.graphData.nodes.forEach(
        ({ public_key, alias, color, updated_at }) => {
          this.nodesMap.set(public_key, {
            alias,
            pubKey: public_key,
            color,
            lastUpdate: new Date(updated_at).valueOf(),
            partners: new Set<Node>(),
          });
        },
      );

      this.graphData.channels.forEach(({ policies }) => {
        const node1 = this.nodesMap.get(policies[0].public_key);
        const node2 = this.nodesMap.get(policies[1].public_key);

        if (!node1 || !node2) {
          return;
        }

        node1.partners.add(node2);
        node2.partners.add(node1);
      });
    });
  }

  public getGraph({ start }: { start: string }): GraphResponseDto {
    if (!this.graphData) {
      console.log('Graph not ready yet');
      return { edges: [], nodes: [] };
    }

    const nodes = this.traverseNodes({
      start,
    });

    const edges = this.getEdges(nodes);

    const interConnectedNodes = new Map<string, number>();

    for (const edge of edges) {
      interConnectedNodes.set(
        edge.source,
        (interConnectedNodes.get(edge.source) || 0) + 1,
      );
      interConnectedNodes.set(
        edge.target,
        (interConnectedNodes.get(edge.target) || 0) + 1,
      );
    }

    return {
      edges,
      nodes: nodes
        .map((node) => ({
          ...node,
          connections: interConnectedNodes.get(node.id) || 0,
        }))
        .sort((a, b) => b.connections - a.connections),
    };
  }

  private getEdges(nodes: NodeResponseDto[]): EdgeResponseDto[] {
    const edgeResponseDto: EdgeResponseDto[] = [];
    const rawNodes = nodes.map((node) => node.id);
    const edgeSet = new Set<string>();

    this.graphData.channels.forEach(({ policies }) => {
      if (
        rawNodes.includes(policies[0].public_key) &&
        rawNodes.includes(policies[1].public_key)
      ) {
        edgeSet.add(`${policies[0].public_key}_${policies[1].public_key}`);
      }
    });

    edgeSet.forEach((edgeString) => {
      const edge = edgeString.split('_');
      edgeResponseDto.push({ source: edge[0], target: edge[1] });
    });

    return edgeResponseDto;
  }

  private traverseNodes({
    start,
    maxPartners,
  }: {
    start: string;
    maxPartners?: number;
  }): NodeResponseDto[] {
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

      const partners = Array.from(node.partners);

      partners.slice(0, maxPartners).forEach((partner) => {
        if (!visited.has(partner.pubKey)) {
          visited.add(partner.pubKey);
          const distance = distances.get(node.pubKey) + 1;
          distances.set(partner.pubKey, distance);

          queue.push(partner);

          const channelCount = partner.partners.size;

          if (
            distance >= MIN_DISTANCE &&
            channelCount <= MAX_CHANNELS &&
            channelCount >= MIN_CHANNELS &&
            Date.now() - partner.lastUpdate <= TWO_WEEKS // last update in less than 2 weeks
          ) {
            response.unshift({
              alias: partner.alias || 'unknown',
              channelCount,
              id: partner.pubKey,
              distance,
              color: partner.color,
              lastUpdate: partner.lastUpdate,
              connections: 0,
            });
          }
        }
      });
    }

    return response;
  }
}
