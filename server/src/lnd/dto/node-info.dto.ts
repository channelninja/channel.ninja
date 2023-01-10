import { Expose, Type } from 'class-transformer';
import { IsNumber, IsString, ValidateNested } from 'class-validator';

class SocketDto {
  @IsString()
  @Expose()
  public socket: string;

  @IsString()
  @Expose()
  public type: string;
}

export class NodeInfoDto {
  @IsString()
  @Expose()
  alias: string;

  @IsNumber()
  @Expose()
  capacity: number;

  @IsNumber()
  @Expose()
  channel_count: number;

  @IsString()
  @Expose()
  color: string;

  @ValidateNested({ each: true })
  @Type(() => SocketDto)
  @Expose()
  sockets: SocketDto[];

  @IsString()
  @Expose()
  updated_at?: string;
}
