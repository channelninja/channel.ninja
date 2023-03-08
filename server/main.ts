import { NestFactory } from '@nestjs/core';
import session from 'express-session';
import { AppModule } from './app.module';

import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RedocModule, RedocOptions } from '@nicholas.braun/nestjs-redoc';
import connectPgSimple from 'connect-pg-simple';
import expressSession from 'express-session';
import { Logger } from 'nestjs-pino';
import { ChannelNinjaConfig } from './core/config/configuration/channel-ninja.config';
import { Configuration } from './core/config/configuration/configuration.enum';
import { DatabaseConfig } from './core/config/configuration/database.config';
import { Environment } from './core/config/environment.enum';
import { logger } from './core/logger/logger.middleware';

const pgSession = connectPgSimple(expressSession);

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(app.get(Logger));
  app.use(logger);
  app.enableCors();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: true,
      whitelist: true, // If set to true validator will strip validated object of any properties that do not have any decorators.
      forbidNonWhitelisted: true, // If set to true, instead of stripping non-whitelisted properties validator will throw an error
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.set('trust proxy', 1); // trust first proxy

  const configService = app.get<ConfigService>(ConfigService);
  const {
    database,
    host,
    password,
    port,
    ca,
    username: user,
  } = configService.get<DatabaseConfig>(Configuration.database);
  const NODE_ENV = configService.get<Environment>('NODE_ENV');
  const { sessionSecret } = configService.get<ChannelNinjaConfig>(Configuration.channelNinja);

  app.use(
    session({
      store: new pgSession({
        tableName: 'user_sessions', // Use another table-name than the default "session" one
        createTableIfMissing: true,
        conObject: {
          host,
          port,
          user,
          password,
          database,
          ssl: NODE_ENV === Environment.Production ? { ca } : false,
        },
      }),
      cookie: {
        maxAge: 1 * 60 * 60 * 1000, // 1 hour
        secure: 'auto',
        httpOnly: true,
      },
      name: 'sessionId',
      secret: sessionSecret,
      resave: false,
      saveUninitialized: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('channel.ninja')
    .setDescription('channel.ninja API description')
    .setVersion('1.0.0')
    .addBasicAuth()
    .build();

  const options = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };

  const document = SwaggerModule.createDocument(app, config, options);

  const redocOptions: RedocOptions = {
    title: 'channel.ninja docs',
    logo: {
      url: 'https://channel.ninja/logo192.png',
      backgroundColor: '#ffffff',
      altText: 'channel.ninja logo',
    },
    sortPropsAlphabetically: true,
    hideDownloadButton: false,
    hideHostname: false,
  };

  // Instead of using SwaggerModule.setup() you call this module
  await RedocModule.setup('/docs', app, document, redocOptions);

  await app.listen(3001);
}

bootstrap();
