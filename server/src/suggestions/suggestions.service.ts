import { Injectable } from '@nestjs/common';
import { NodeResponseDto } from 'src/graph/dtos/node-response.dto';
import { GraphService } from 'src/graph/graph.service';

@Injectable()
export class SuggestionsService {
  constructor(private graphService: GraphService) {}

  public getSuggestions(start: string): NodeResponseDto[] {
    const graph = this.graphService.getGraph({ start });

    return graph.nodes;
  }
}
