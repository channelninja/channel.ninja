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

const pgSession = connectPgSimple(expressSession);

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

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

  app.use(
    session({
      store: new pgSession({
        tableName: 'user_sessions', // Use another table-name than the default "session" one
        createTableIfMissing: true,
        conObject: {
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          user: configService.get('DB_USER'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          ssl: process.env.NODE_ENV === 'production',
        },
      }),
      cookie: {
        maxAge: 1 * 60 * 60 * 1000, // 1 hour
        secure: 'auto',
        httpOnly: true,
      },
      name: 'sessionId',
      secret: process.env.SESSION_SECRET,
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
