import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphModule } from './graph/graph.module';
import { LndModule } from './lnd/lnd.module';
import { StaticModule } from './static/static.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      autoLoadEntities: true,
      database: process.env.DB_PATH,
      synchronize: true,
    }),
    StaticModule.forRoot(),
    ScheduleModule.forRoot(),
    GraphModule,
    LndModule,
  ],
})
export class AppModule {}
