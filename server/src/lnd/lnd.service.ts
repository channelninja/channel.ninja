import { forwardRef, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import {
  AuthenticatedLnd,
  authenticatedLndGrpc,
  createInvoice,
  getInvoice,
  getNetworkGraph,
  GetNetworkGraphResult,
  getNode,
  GetNodeResult,
  subscribeToInvoice,
  SubscribeToInvoiceInvoiceUpdatedEvent,
} from 'lightning';
import { FeesService } from 'src/fees/fees.service';
import { LndInvoiceResponseDto } from './dto/lnd-invoice-response.dto';
import { LndGateway } from './lnd.gateway';

@Injectable()
export class LndService {
  private lnd: AuthenticatedLnd;

  constructor(private feesService: FeesService, @Inject(forwardRef(() => LndGateway)) private lndGateWay: LndGateway) {
    const { lnd } = authenticatedLndGrpc({
      cert: process.env.CERT ?? '',
      macaroon: process.env.MACAROON,
      socket: process.env.SOCKET,
    });

    this.lnd = lnd;
  }

  public async getNodeInfo(pubkey: string): Promise<GetNodeResult> {
    try {
      return await getNode({
        lnd: this.lnd,
        public_key: pubkey,
        is_omitting_channels: true,
      });
    } catch (error) {
      throw new NotFoundException();
    }
  }

  public async fetchNetworkGraph(): Promise<GetNetworkGraphResult> {
    try {
      console.time('fetchNetworkGraph');

      const graphData = await getNetworkGraph({ lnd: this.lnd });

      console.timeEnd('fetchNetworkGraph');

      return graphData;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Could not fetch network graph');
    }
  }

  public async getOrCreateInvoice(invoiceId?: string): Promise<LndInvoiceResponseDto> {
    if (invoiceId) {
      const invoice = await getInvoice({ lnd: this.lnd, id: invoiceId });

      if (new Date(invoice.expires_at).valueOf() < Date.now()) {
        return await this.createInvoice();
      }
      //test
      if (invoice) {
        return {
          id: invoice.id,
          request: invoice.request,
          isPaid: invoice.is_confirmed,
        };
      }
    }

    return await this.createInvoice();
  }

  public async createInvoice(): Promise<LndInvoiceResponseDto> {
    const fees = await this.feesService.getFee();
    const expires_at = new Date(Date.now() + 1000 * 60 * 60 * 1).toISOString();
    const tokens = process.env.NODE_ENV === 'production' ? fees : 1;

    const createdInvoice = await createInvoice({
      lnd: this.lnd,
      tokens,
      expires_at,
    });

    const sub = subscribeToInvoice({ id: createdInvoice.id, lnd: this.lnd });

    sub.addListener('invoice_updated', async (invoice: SubscribeToInvoiceInvoiceUpdatedEvent) => {
      if (process.env.NODE_ENV !== 'production') {
        console.log('invoice_updated', invoice);
      }

      if (invoice.is_confirmed) {
        this.lndGateWay.invoiceConfirmed(invoice.id);
      }
    });

    return {
      request: createdInvoice.request,
      id: createdInvoice.id,
      isPaid: false,
    };
  }

  public async checkInvoiceStatus(id: string): Promise<void> {
    const invoice = await getInvoice({ lnd: this.lnd, id });

    if (invoice && invoice.is_confirmed) {
      this.lndGateWay.invoiceConfirmed(invoice.id);
    }
  }
}
