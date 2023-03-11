import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import pino from 'pino';
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
        const { logLevel: level, logtailToken } = config.get<ChannelNinjaConfig>(Configuration.channelNinja);

        const formatters = {
          level: (label: string, value: number) => {
            return { level: value, levelValue: value };
          },
        };

        const pinoPrettyTarget: pino.TransportTargetOptions<Record<string, any>> = {
          target: 'pino-pretty',
          options: { singleLine: true, colorize: true },
          level,
        };

        const logtailTarget: pino.TransportTargetOptions<Record<string, any>> = {
          target: '@logtail/pino',
          options: { sourceToken: logtailToken },
          level,
        };

        if (isProduction) {
          return {
            renameContext: 'namespace',
            pinoHttp: {
              level,
              formatters,
              transport: logtailToken ? logtailTarget : undefined,
            },
          };
        }

        return {
          renameContext: 'namespace',
          pinoHttp: {
            level,
            formatters,
            transport: pinoPrettyTarget,
          },
        };
      },
    }),
  ],
})
export class LoggerModule {}
