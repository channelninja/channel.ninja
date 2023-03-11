import { Module } from '@nestjs/common';
import { FeesModule } from '../fees/fees.module';
import { LndController } from './lnd.controller';
import { LndGateway } from './lnd.gateway';
import { LndService } from './lnd.service';

@Module({
  imports: [FeesModule],
  providers: [LndService, LndGateway],
  exports: [LndService],
  controllers: [LndController],
})
export class LndModule {}
