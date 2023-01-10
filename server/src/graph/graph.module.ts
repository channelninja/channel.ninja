import { Module } from '@nestjs/common';
import { LndModule } from '../lnd/lnd.module';
import { GraphController } from './graph.controller';
import { GraphService } from './graph.service';

@Module({
  imports: [LndModule],
  controllers: [GraphController],
  providers: [GraphService],
})
export class GraphModule {}
