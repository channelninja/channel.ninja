import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { FeesModule } from './api/fees/fees.module';
import { GraphModule } from './api/graph/graph.module';
import { InitModule } from './api/init/init.module';
import { LndModule } from './api/lnd/lnd.module';
import { SettingsModule } from './api/settings/settings.module';
import { SuggestionsModule } from './api/suggestions/suggestions.module';
import { AuthModule } from './core/auth/auth.module';
import configuration from './core/config/configuration';
import { validate } from './core/config/validate';
import { DatabaseModule } from './core/database/database.module';
import { LoggerModule } from './core/logger/logger.module';
import { StaticModule } from './core/static/static.module';

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
