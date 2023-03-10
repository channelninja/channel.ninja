import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import EventEmitter from 'events';
import {
  AuthenticatedLnd,
  authenticatedLndGrpc,
  createInvoice,
  getInvoice,
  getNetworkGraph,
  GetNetworkGraphResult,
  getNode,
  GetNodeResult,
  subscribeToGraph,
  subscribeToInvoice,
  SubscribeToInvoiceInvoiceUpdatedEvent,
} from 'lightning';
import { Configuration } from 'server/core/config/configuration/configuration.enum';
import { LndNodeConfig } from 'server/core/config/configuration/lnd-node.config';
import { handleCatchError } from 'server/shared/utils/handle-catch-error';
import { FeesService } from '../fees/fees.service';
import { LndInvoiceResponseDto } from './dto/lnd-invoice-response.dto';
import { LndGateway } from './lnd.gateway';

@Injectable()
export class LndService {
  private logger = new Logger(LndService.name);
  private lnd: AuthenticatedLnd;

  constructor(
    private feesService: FeesService,
    @Inject(forwardRef(() => LndGateway)) private lndGateWay: LndGateway,
    private configService: ConfigService,
  ) {
    const { macaroon, socket, cert } = this.configService.get<LndNodeConfig>(Configuration.lndNode);

    const { lnd } = authenticatedLndGrpc({ cert, macaroon, socket });

    this.lnd = lnd;
  }

  public subscribeToGraph(): EventEmitter {
    return subscribeToGraph({ lnd: this.lnd });
  }

  public async getNodeInfo(pubkey: string): Promise<GetNodeResult> {
    try {
      return await getNode({
        lnd: this.lnd,
        public_key: pubkey,
        is_omitting_channels: true,
      });
    } catch (error) {
      handleCatchError(error, this.logger, 'Could not get node info.');

      throw new NotFoundException();
    }
  }

  public async fetchNetworkGraph(): Promise<GetNetworkGraphResult> {
    this.logger.verbose('fetchNetworkGraph - start');
    const start = Date.now();

    try {
      const graphData = await getNetworkGraph({ lnd: this.lnd });

      const end = Date.now();
      this.logger.verbose(`fetchNetworkGraph - end`, { duration: end - start });

      return graphData;
    } catch (error) {
      handleCatchError(error, this.logger, 'Could not fetch network graph');

      throw new InternalServerErrorException('Could not fetch network graph');
    }
  }

  public async getOrCreateInvoice(invoiceId?: string): Promise<LndInvoiceResponseDto> {
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
    const fees = await this.feesService.getFee();
    const expires_at = new Date(Date.now() + 1000 * 60 * 60 * 1).toISOString();
    const tokens = fees;

    const createdInvoice = await createInvoice({
      lnd: this.lnd,
      tokens,
      expires_at,
    });

    const sub = subscribeToInvoice({ id: createdInvoice.id, lnd: this.lnd });

    sub.addListener('invoice_updated', async (invoice: SubscribeToInvoiceInvoiceUpdatedEvent) => {
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
