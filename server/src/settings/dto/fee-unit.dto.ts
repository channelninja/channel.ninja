import { IsEnum } from 'class-validator';

export enum FeeUnit {
  sats = 'sats',
  cents = 'cents',
}

export class FeeUnitDto {
  @IsEnum(FeeUnit)
  public value: FeeUnit;
}
