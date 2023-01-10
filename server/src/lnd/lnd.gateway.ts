import { forwardRef, Inject } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { LndService } from './lnd.service';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class LndGateway {
  constructor(
    @Inject(forwardRef(() => LndService)) private lndService: LndService,
  ) {}

  @WebSocketServer() server: Server;

  public invoiceConfirmed(id: string): void {
    this.server.emit('lnd:invoice-confirmed', id);
  }

  @SubscribeMessage('lnd:check-invoice-status')
  public async handleCheckInvoiceStatus(
    @MessageBody() data: { id: string },
  ): Promise<void> {
    await this.lndService.checkInvoiceStatus(data.id);
  }
}
