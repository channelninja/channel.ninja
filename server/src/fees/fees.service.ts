import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SATS_IN_ONE_BITCOIN } from 'src/core/global-constans';
import { FeeUnit } from 'src/settings/dto/fee-unit.dto';
import { SettingsService } from 'src/settings/settings.service';
import { CoinApiResponse } from './coin-api-response.type';
import { DEFAULT_FEE } from './default-fee.constant';

@Injectable()
export class FeesService {
  constructor(
    private settingsService: SettingsService,
    private configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  public async getFee(): Promise<number> {
    const feeSettings = await this.settingsService.getFeeSettings();

    if (feeSettings.fee_unit === FeeUnit.sats) {
      return feeSettings.fee_amount;
    }

    if (feeSettings.fee_unit === FeeUnit.cents) {
      const oneDollarInBtc = await this.getExchangeRate();

      if (oneDollarInBtc === null) {
        return DEFAULT_FEE;
      }

      const oneDollarInSats = oneDollarInBtc * SATS_IN_ONE_BITCOIN;
      const tenCentsInSats = oneDollarInSats / 10;

      // round to next higer multiple of 500
      const fee = Math.ceil(tenCentsInSats / 500) * 500;

      return fee;
    }

    return DEFAULT_FEE;
  }

  private async getExchangeRate(): Promise<number | null> {
    const coinApiKey = this.configService.get<string>('COIN_API_KEY');

    if (!coinApiKey) {
      console.warn(`COIN_API_KEY not set`);

      return null;
    }

    try {
      const res = await this.httpService.axiosRef.get<CoinApiResponse>(
        'https://rest.coinapi.io/v1/exchangerate/USD/BTC',
        {
          headers: { 'X-CoinAPI-Key': coinApiKey },
        },
      );

      return res.data.rate;
    } catch (error) {
      console.error(error);
    }

    return null;
  }
}
