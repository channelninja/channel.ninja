import { NestFactory } from '@nestjs/core';
import sqlite from 'better-sqlite3';
import session from 'express-session';
import { AppModule } from './app.module';

import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RedocModule, RedocOptions } from '@nicholas.braun/nestjs-redoc';
import betterSqlite3SessionStore from 'better-sqlite3-session-store';
const SqliteStore = betterSqlite3SessionStore(session);

const db = new sqlite(process.env.DB_PATH);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  app.use(
    session({
      store: new SqliteStore({
        client: db,
        expired: {
          clear: true,
          intervalMs: 900000, //ms = 15min
        },
      }),
      cookie: {
        maxAge: 1 * 60 * 60 * 1000, // 1 hour
      },
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
