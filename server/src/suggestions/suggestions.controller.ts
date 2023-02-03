import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { NodeResponseDto } from 'src/graph/dtos/node-response.dto';
import { SuggestionsService } from './suggestions.service';

@ApiTags('suggestions')
@Controller('suggestions')
export class SuggestionsController {
  constructor(private suggestionsService: SuggestionsService) {}

  @ApiOperation({
    description: 'Returns suggested nodes for :start node',
  })
  @Get('/:start')
  public async getSuggestions(@Param('start') start: string): Promise<NodeResponseDto[]> {
    return await this.suggestionsService.getSuggestions(start);
  }
}
