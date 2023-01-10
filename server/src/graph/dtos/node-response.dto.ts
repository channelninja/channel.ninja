import { Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class NodeResponseDto {
  @Expose()
  @IsString()
  public alias: string;

  @Expose()
  @IsNumber()
  public channelCount: number;

  @Expose()
  @IsString()
  public id: string;

  @Expose()
  @IsNumber()
  public distance: number;

  @Expose()
  @IsString()
  public color: string;

  @Expose()
  @IsNumber()
  public lastUpdate: number;

  @Expose()
  @IsNumber()
  public connections: number;
}
