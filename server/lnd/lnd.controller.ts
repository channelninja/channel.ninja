import { Controller, Get, Logger, Param, Post, Session } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LndInvoiceResponseDto } from './dto/lnd-invoice-response.dto';
import { NodeInfoDto } from './dto/node-info.dto';
import { LndService } from './lnd.service';

@ApiTags('lnd')
@Controller('lnd')
export class LndController {
  private logger = new Logger(LndController.name);
  constructor(private lndService: LndService) {}

  @ApiOperation({
    description: 'Creates an invoice',
  })
  @Post('/invoice')
  public async createInvoice(@Session() session: Record<string, string>): Promise<LndInvoiceResponseDto> {
    this.logger.verbose({ session }, 'createInvoice');

    const invoice = await this.lndService.getOrCreateInvoice(session.invoiceId);
    session.invoiceId = invoice.id;

    return invoice;
  }

  @ApiOperation({
    description: 'Gets the node info',
  })
  @Get('/nodeInfo/:pubkey')
  public async getNodeInfo(@Param('pubkey') pubkey: string): Promise<NodeInfoDto> {
    this.logger.verbose({ pubkey }, 'getNodeInfo');

    return this.lndService.getNodeInfo(pubkey);
  }
}
