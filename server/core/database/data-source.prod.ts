import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { migrations } from '../../migrations';
import { Configuration } from '../config/configuration/configuration.enum';
import { DatabaseConfig } from '../config/configuration/database.config';
import { Environment } from '../config/environment.enum';

config();

const configService = new ConfigService();
const { database, host, password, port, ca, username } = configService.get<DatabaseConfig>(Configuration.database);
const NODE_ENV = configService.get<Environment>('NODE_ENV');

export default new DataSource({
  host,
  port,
  username,
  password,
  database,
  ssl: NODE_ENV === Environment.Production ? { ca } : false,
  type: 'postgres',
  synchronize: false,
  migrationsRun: true,
  migrationsTransactionMode: 'all',
  entities: ['dist/**/*.entity.js', '**/*.entity.ts'],
  migrations,
});
