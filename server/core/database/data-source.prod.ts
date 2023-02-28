import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { migrations } from '../../migrations';

config();

const configService = new ConfigService();

const dbHost = configService.get('DB_HOST');
const dbPort = configService.get('DB_PORT');
const dbUser = configService.get('DB_USER');
const dbPassword = configService.get('DB_PASSWORD');
const dbDatabase = configService.get('DB_DATABASE');

export default new DataSource({
  host: dbHost,
  port: dbPort,
  username: dbUser,
  password: dbPassword,
  database: dbDatabase,
  ssl: process.env.NODE_ENV === 'production',
  type: 'postgres',
  synchronize: false,
  migrationsRun: true,
  migrationsTransactionMode: 'all',
  entities: ['dist/**/*.entity.js', '**/*.entity.ts'],
  migrations,
});
