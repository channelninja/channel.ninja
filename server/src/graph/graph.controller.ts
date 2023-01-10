import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GraphResponseDto } from './dtos/graph-response.dto';
import { GraphService } from './graph.service';

@ApiTags('graph')
@Controller('graph')
export class GraphController {
  constructor(private graphService: GraphService) {}

  @ApiOperation({
    description: 'Returns the graph',
  })
  @Get('/network/:start')
  public getGraph(@Param('start') start: string): GraphResponseDto {
    return this.graphService.getGraph({
      start,
    });
  }
}
