import { IsBoolean, IsNumber } from 'class-validator';

export class InitResponseDto {
  @IsNumber()
  public fee: number;

  @IsBoolean()
  public maintenance: boolean;
}
