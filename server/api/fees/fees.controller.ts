import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetOnchainFeesEstimate } from './dtos/GetOnchainFeesEstimateResult.dto';
import { FeesService } from './fees.service';

@ApiTags('fees')
@Controller('fees')
export class FeesController {
  constructor(private feesService: FeesService) {}

  @ApiOperation({
    description: 'Gets an estimate for onchain transaction fees.',
  })
  @Get('onchain')
  public async getOnchainFeesEstimate(): Promise<GetOnchainFeesEstimate> {
    return await this.feesService.getOnchainFeesEstimate();
  }
}
