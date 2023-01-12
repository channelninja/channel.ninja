import { Module } from '@nestjs/common';
import { LndModule } from '../lnd/lnd.module';
import { GraphService } from './graph.service';

@Module({
  imports: [LndModule],
  providers: [GraphService],
  exports: [GraphService],
})
export class GraphModule {}
