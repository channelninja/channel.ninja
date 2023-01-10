import { IsBoolean, IsString } from 'class-validator';

export class LndInvoiceResponseDto {
  @IsString()
  public id: string;

  @IsString()
  public request: string;

  @IsBoolean()
  public isPaid: boolean;
}
