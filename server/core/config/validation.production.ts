import { IsString } from 'class-validator';
import { DevelopmentEnvironmentVariables } from './validation.development';

export class ProductionEnvironmentVariables extends DevelopmentEnvironmentVariables {
  @IsString()
  SSL_CERT: string;
}
