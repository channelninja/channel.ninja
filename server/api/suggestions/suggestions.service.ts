import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configuration } from 'server/core/config/configuration/configuration.enum';
import { SuggestionsConfig } from 'server/core/config/configuration/suggestions.config';
import { NodeResponseDto } from '../graph/dtos/node-response.dto';
import { GraphService } from '../graph/graph.service';

@Injectable()
export class SuggestionsService {
  private logger = new Logger(SuggestionsService.name);
  constructor(private graphService: GraphService, private configService: ConfigService) {}

  public async getSuggestions(start: string): Promise<NodeResponseDto[]> {
    this.logger.verbose({ start }, `getSuggestions`);

    const nodes = this.graphService.getNodes({ start });
    const { maxChannels, minAvgChannelSize, minChannels, minDistance, maxLastUpdatedDurationMS } =
      this.configService.get<SuggestionsConfig>(Configuration.suggestions);

    const filteredNodes = nodes.filter((node) => {
      if (node.channelCount < minChannels || node.channelCount > maxChannels) {
        return false;
      }

      if (node.distance < minDistance) {
        return false;
      }

      const lastUpdateIsValidDuration = Date.now() - node.lastUpdate <= maxLastUpdatedDurationMS;

      if (!lastUpdateIsValidDuration) {
        return false;
      }

      if (node.avgChannelSize < minAvgChannelSize) {
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
