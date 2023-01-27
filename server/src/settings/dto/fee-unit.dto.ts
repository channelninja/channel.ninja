import { IsEnum } from 'class-validator';

export enum FeeUnitValue {
  sats = 'sats',
  cents = 'cents',
}

export class FeeUnitDto {
  @IsEnum(FeeUnitValue)
  public value: FeeUnitValue;
}
