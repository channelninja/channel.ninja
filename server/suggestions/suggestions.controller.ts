import { Controller, Get, Logger, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { NodeResponseDto } from '../graph/dtos/node-response.dto';
import { SuggestionsService } from './suggestions.service';

@ApiTags('suggestions')
@Controller('suggestions')
export class SuggestionsController {
  private logger = new Logger(SuggestionsController.name);
  constructor(private suggestionsService: SuggestionsService) {}

  @ApiOperation({
    description: 'Returns suggested nodes for :start node',
  })
  @Get('/:start')
  public async getSuggestions(@Param('start') start: string): Promise<NodeResponseDto[]> {
    this.logger.verbose({ start }, 'getSuggestions');

    return await this.suggestionsService.getSuggestions(start);
  }
}
