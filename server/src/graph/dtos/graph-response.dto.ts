import { Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { EdgeResponseDto } from './edge-response.dto';
import { NodeResponseDto } from './node-response.dto';

export class GraphResponseDto {
  @ValidateNested({ each: true })
  @Type(() => NodeResponseDto)
  @Expose()
  public nodes: NodeResponseDto[];

  @ValidateNested({ each: true })
  @Type(() => EdgeResponseDto)
  @Expose()
  public edges: EdgeResponseDto[];
}
