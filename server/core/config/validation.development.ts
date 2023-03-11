import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Level } from 'pino';
import { Environment } from './environment.enum';

export class DevelopmentEnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsString()
  MACAROON: string;

  @IsString()
  SOCKET: string;

  @IsOptional()
  @IsString()
  CERT: string;

  @IsOptional()
  @IsBoolean()
  FORCE_FETCH_GRAPH: boolean;

  @IsString()
  SESSION_SECRET: string;

  @IsString()
  HTTP_BASIC_USER: string;

  @IsString()
  HTTP_BASIC_PASS: string;

  @IsString()
  COIN_API_KEY: string;

  @IsString()
  API_URL: string;

  @IsString()
  DB_HOST: string;

  @IsNumber()
  DB_PORT: number;

  @IsString()
  DB_PASSWORD: string;

  @IsString()
  DB_USER: string;

  @IsString()
  DB_DATABASE: string;

  @IsOptional()
  @IsNumber()
  MIN_CHANNELS: number;

  @IsOptional()
  @IsNumber()
  MAX_CHANNELS: number;

  @IsOptional()
  @IsNumber()
  MIN_AVG_CHANNEL_SIZE: number;

  @IsOptional()
  @IsNumber()
  MIN_DISTANCE: number;

  @IsOptional()
  @IsNumber()
  MAX_LAST_UPDATED_DURATION_MS: number;

  @IsOptional()
  @IsString()
  TX_EXPLORER_URL: string;

  @IsOptional()
  @IsString()
  LOG_LEVEL: Level;

  @IsOptional()
  @IsString()
  LOGTAIL_TOKEN: string;
}
