import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { migrations } from '../../migrations';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'better-sqlite3',
  database: configService.get('DB_PATH'),
  synchronize: false,
  migrationsRun: true,
  migrationsTransactionMode: 'all',
  entities: ['dist/**/*.entity.js', '**/*.entity.ts'],
  migrations,
});
