import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { migrations } from 'server/migrations';
import { Configuration } from '../config/configuration/configuration.enum';
import { DatabaseConfig } from '../config/configuration/database.config';
import { Environment } from '../config/environment.enum';

@Injectable()
export class DatabaseService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const { database, host, password, port, ca, username } = this.configService.get<DatabaseConfig>(
      Configuration.database,
    );
    const NODE_ENV = this.configService.get<Environment>('NODE_ENV');

    return {
      host,
      port,
      username,
      password,
      database,
      ssl: NODE_ENV === Environment.Production ? { ca } : false,
      type: 'postgres',
      autoLoadEntities: true,
      synchronize: false,
      migrationsRun: true,
      migrations,
    };
  }
}
