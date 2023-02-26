import { IsNumber } from 'class-validator';

export class FeeAmountDto {
  @IsNumber()
  public value: number;
}
