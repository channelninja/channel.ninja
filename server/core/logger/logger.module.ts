import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { join } from 'path';
import pino from 'pino';
import pinoCaller from 'pino-caller';
import { ChannelNinjaConfig } from '../config/configuration/channel-ninja.config';
import { Configuration } from '../config/configuration/configuration.enum';
import { Environment } from '../config/environment.enum';

@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const isProduction = config.get('NODE_ENV') === Environment.Production;
        const { logLevel: level } = config.get<ChannelNinjaConfig>(Configuration.channelNinja);

        const productionLogger = pino({
          level,
        });

        const developmentLogger = pinoCaller(
          pino({
            level,
            transport: {
              target: 'pino-pretty',
              options: { singleLine: true },
              level,
            },
          }),
          {
            stackAdjustment: 6,
            relativeTo: join(__dirname, '..', '..', '..'),
          },
        );

        return {
          useExisting: isProduction ? undefined : true,
          pinoHttp: {
            level,
            logger: isProduction ? productionLogger : developmentLogger,
          },
        };
      },
    }),
  ],
})
export class LoggerModule {}
