import { forwardRef, HttpException, Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
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
import { LndInvoiceResponseDto } from './dto/lnd-invoice-response.dto';
import { LndGateway } from './lnd.gateway';

@Injectable()
export class LndService {
  private lnd: AuthenticatedLnd;
  private graph: GetNetworkGraphResult;

  constructor(
    @Inject(forwardRef(() => LndGateway)) private lndGateWay: LndGateway,
  ) {
    const { lnd } = authenticatedLndGrpc({
      cert: '',
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
      console.error(error);
      throw new HttpException('Could not get node info.', 500);
    }
  }

  public async getGraph(): Promise<GetNetworkGraphResult> {
    if (this.graph) {
      return this.graph;
    }

    return this.fetchNetworkGraph();
  }

  @Cron('0 7 * * *')
  private async fetchNetworkGraph(): Promise<GetNetworkGraphResult> {
    console.log('fetchNetworkGraph');

    if (
      process.env.NODE_ENV === 'production' ||
      process.env.FORCE_FETCH_GRAPH === 'true'
    ) {
      this.graph = await getNetworkGraph({ lnd: this.lnd });
    } else {
      this.graph = (await import(
        './data/graph.json'
      )) as unknown as GetNetworkGraphResult;
    }

    console.log('Graph fetched!');

    return this.graph;
  }

  public async getOrCreateInvoice(
    invoiceId?: string,
  ): Promise<LndInvoiceResponseDto> {
    if (invoiceId) {
      const invoice = await getInvoice({ lnd: this.lnd, id: invoiceId });

      if (new Date(invoice.expires_at).valueOf() < Date.now()) {
        return await this.createInvoice();
      }

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
    const expires_at = new Date(Date.now() + 1000 * 60 * 60 * 1).toISOString();
    const tokens = process.env.NODE_ENV === 'production' ? 1000 : 1;

    const createdInvoice = await createInvoice({
      lnd: this.lnd,
      tokens,
      expires_at,
    });

    const sub = subscribeToInvoice({ id: createdInvoice.id, lnd: this.lnd });

    sub.addListener(
      'invoice_updated',
      async (invoice: SubscribeToInvoiceInvoiceUpdatedEvent) => {
        if (process.env.NODE_ENV !== 'production') {
          console.log('invoice_updated', invoice);
        }

        if (invoice.is_confirmed) {
          this.lndGateWay.invoiceConfirmed(invoice.id);
        }
      },
    );

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
