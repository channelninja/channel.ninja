import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import pino from 'pino';
import { AuthModule } from './auth/auth.module';
import { FeesModule } from './fees/fees.module';
import { GraphModule } from './graph/graph.module';
import { InitModule } from './init/init.module';
import { LndModule } from './lnd/lnd.module';
import { migrations } from './migrations';
import { SettingsModule } from './settings/settings.module';
import { StaticModule } from './static/static.module';
import { SuggestionsModule } from './suggestions/suggestions.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USER'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          ssl: process.env.NODE_ENV === 'production',
          type: 'postgres',
          autoLoadEntities: true,
          synchronize: false,
          migrationsRun: true,
          migrations,
        };
      },
      inject: [ConfigService],
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        enabled: true,
        stream: pino.destination({
          // Buffer before writing
          minLength: 4096,
          // Asynchronous logging
          sync: false,
        }),
        customProps: (_req, _res) => ({
          context: 'HTTP',
        }),
        transport: {
          target: 'pino-http-print',
          options: {
            colorize: true,
            translateTime: true,
            relativeUrl: true,
          },
        },
      },
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
