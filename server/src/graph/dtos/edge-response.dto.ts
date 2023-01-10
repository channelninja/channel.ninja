import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class EdgeResponseDto {
  @IsString()
  @Expose()
  public source: string;

  @IsString()
  @Expose()
  public target: string;
}
