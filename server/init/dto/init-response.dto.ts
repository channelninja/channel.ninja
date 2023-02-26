import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class InitResponseDto {
  @IsNumber()
  public fee: number;

  @IsBoolean()
  public maintenance: boolean;

  @IsString()
  public apiUrl: string;
}
