import { Module } from '@nestjs/common';
import { LndController } from './lnd.controller';
import { LndGateway } from './lnd.gateway';
import { LndService } from './lnd.service';

@Module({
  providers: [LndService, LndGateway],
  exports: [LndService],
  controllers: [LndController],
})
export class LndModule {}
