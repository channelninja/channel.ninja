import { Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class GetOnchainFeesEstimate {
  @IsNumber()
  @Expose()
  public fastestFee: number;

  @IsNumber()
  @Expose()
  public halfHourFee: number;

  @IsNumber()
  @Expose()
  public hourFee: number;

  @IsNumber()
  @Expose()
  public economyFee: number;

  @IsNumber()
  @Expose()
  public minimumFee: number;
}
