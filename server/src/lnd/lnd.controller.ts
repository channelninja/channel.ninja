import { Controller, Get, Param, Post, Session } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LndInvoiceResponseDto } from './dto/lnd-invoice-response.dto';
import { NodeInfoDto } from './dto/node-info.dto';
import { LndService } from './lnd.service';

@ApiTags('lnd')
@Controller('lnd')
export class LndController {
  constructor(private lndService: LndService) {}

  @ApiOperation({
    description: 'Creates an invoice',
  })
  @Post('/invoice')
  public async createInvoice(
    @Session() session: Record<string, string>,
  ): Promise<LndInvoiceResponseDto> {
    console.log('session.invoiceId', session.invoiceId);

    const invoice = await this.lndService.getOrCreateInvoice(session.invoiceId);
    session.invoiceId = invoice.id;

    return invoice;
  }

  @ApiOperation({
    description: 'Gets the node info',
  })
  @Get('/nodeInfo/:pubkey')
  public async getNodeInfo(
    @Param('pubkey') pubkey: string,
  ): Promise<NodeInfoDto> {
    return this.lndService.getNodeInfo(pubkey);
  }
}
