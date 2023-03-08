import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import configuration from './core/config/configuration';
import { validate } from './core/config/validate';
import { DatabaseModule } from './core/database/database.module';
import { LoggerModule } from './core/logger/logger.module';
import { FeesModule } from './fees/fees.module';
import { GraphModule } from './graph/graph.module';
import { InitModule } from './init/init.module';
import { LndModule } from './lnd/lnd.module';
import { SettingsModule } from './settings/settings.module';
import { StaticModule } from './static/static.module';
import { SuggestionsModule } from './suggestions/suggestions.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration], validate }),
    DatabaseModule,
    StaticModule.forRoot(),
    ScheduleModule.forRoot(),
    LoggerModule,
    GraphModule,
    LndModule,
    SuggestionsModule,
    AuthModule,
    SettingsModule,
    FeesModule,
    InitModule,
  ],
})
export class AppModule {}
