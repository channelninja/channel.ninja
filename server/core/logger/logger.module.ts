import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { Environment } from '../config/environment.enum';
import { developmentLogger, productionLogger } from './logger.utils';

@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const isProduction = config.get('NODE_ENV') === Environment.Production;

        return {
          useExisting: isProduction ? undefined : true,
          pinoHttp: {
            logger: isProduction ? productionLogger : developmentLogger,
          },
        };
      },
    }),
  ],
})
export class LoggerModule {}
