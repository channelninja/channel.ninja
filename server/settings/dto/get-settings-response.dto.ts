import { IsString } from 'class-validator';

export class GetSettingsResponseDto {
  @IsString()
  public key: string;

  @IsString()
  public value: string;
}
