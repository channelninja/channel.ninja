import { IsEnum } from 'class-validator';

export enum MaintenanceValue {
  true = 'true',
  false = 'false',
}

export class MaintenanceDto {
  @IsEnum(MaintenanceValue)
  public value: MaintenanceValue;
}
