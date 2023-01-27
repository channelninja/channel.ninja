import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { FeesModule } from './fees/fees.module';
import { GraphModule } from './graph/graph.module';
import { InitModule } from './init/init.module';
import { LndModule } from './lnd/lnd.module';
import { SettingsModule } from './settings/settings.module';
import { StaticModule } from './static/static.module';
import { SuggestionsModule } from './suggestions/suggestions.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const database = configService.get('DB_PATH');
        console.log({ database });

        return {
          type: 'better-sqlite3',
          autoLoadEntities: true,
          database: configService.get('DB_PATH'),
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),
    StaticModule.forRoot(),
    ScheduleModule.forRoot(),
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
