import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LndModule } from '../lnd/lnd.module';
import { Channel } from './entities/channel.entity';
import { Node } from './entities/node.entity';
import { GraphService } from './graph.service';

@Module({
  imports: [LndModule, TypeOrmModule.forFeature([Channel, Node])],
  providers: [GraphService],
  exports: [GraphService],
})
export class GraphModule {}
