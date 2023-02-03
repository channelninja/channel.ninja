import { Injectable } from '@nestjs/common';
import { NodeResponseDto } from 'src/graph/dtos/node-response.dto';
import { MAX_CHANNELS, MIN_AVG_CHANNEL_SIZE, MIN_CHANNELS, MIN_DISTANCE, TWO_WEEKS } from 'src/graph/graph.constants';
import { GraphService } from 'src/graph/graph.service';

@Injectable()
export class SuggestionsService {
  constructor(private graphService: GraphService) {}

  public async getSuggestions(start: string): Promise<NodeResponseDto[]> {
    const nodes = this.graphService.getNodes({ start });

    const filteredNodes = nodes.filter((node) => {
      if (node.channelCount < MIN_CHANNELS || node.channelCount > MAX_CHANNELS) {
        return false;
      }

      if (node.distance < MIN_DISTANCE) {
        return false;
      }

      const lastUpdateInLessThatTwoWeeks =
        process.env.NODE_ENV !== 'production' ? true : Date.now() - node.lastUpdate <= TWO_WEEKS;

      if (!lastUpdateInLessThatTwoWeeks) {
        return false;
      }

      if (node.avgChannelSize < MIN_AVG_CHANNEL_SIZE) {
        return false;
      }

      return true;
    });

    const edges = await this.graphService.getEdges(filteredNodes);

    const interConnectedNodes = new Map<string, number>();

    for (const edge of edges) {
      interConnectedNodes.set(edge.source, (interConnectedNodes.get(edge.source) || 0) + 1);
      interConnectedNodes.set(edge.target, (interConnectedNodes.get(edge.target) || 0) + 1);
    }

    return filteredNodes
      .map((node) => ({
        ...node,
        connections: interConnectedNodes.get(node.id) || 0,
      }))
      .sort((a, b) => b.connections - a.connections);
  }
}
