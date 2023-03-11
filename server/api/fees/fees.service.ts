import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { handleCatchError } from 'server/shared/utils/handle-catch-error';
import { Repository } from 'typeorm';
import { SATS_IN_ONE_BITCOIN } from '../../core/global-constans';
import { FeeUnit } from '../settings/dto/fee-unit.dto';
import { SettingsService } from '../settings/settings.service';
import { DEFAULT_FEE } from './default-fee.constant';
import { GetOnchainFeesEstimate } from './dtos/GetOnchainFeesEstimateResult.dto';
import { Fee } from './fee.entity';
import { CoinApiResponse } from './fee.types';

@Injectable()
export class FeesService {
  private logger = new Logger(FeesService.name);

  constructor(
    private settingsService: SettingsService,
    private configService: ConfigService,
    private readonly httpService: HttpService,
    @InjectRepository(Fee) private feesRepository: Repository<Fee>,
  ) {}

  @Cron('0 0 * * *')
  private async dailyFeeJob(): Promise<void> {
    const fee = await this.calculateFeeFromSettings();

    await this.feesRepository.save(this.feesRepository.create({ id: 1, fee }));
  }

  public async getOnchainFeesEstimate(): Promise<GetOnchainFeesEstimate> {
    try {
      const res = await this.httpService.axiosRef.get<GetOnchainFeesEstimate>(
        'https://mempool.space/api/v1/fees/recommended',
      );

      return res.data;
    } catch (error) {
      handleCatchError(error, this.logger, 'Could not get onchain fee estimate. Using default values.');

      return {
        fastestFee: 1,
        halfHourFee: 1,
        hourFee: 1,
        economyFee: 1,
        minimumFee: 1,
      };
    }
  }

  public async getFee(): Promise<number> {
    const result = await this.feesRepository.findOne({ where: { id: 1 } });

    if (result === null) {
      const fee = await this.calculateFeeFromSettings();

      await this.feesRepository.save(this.feesRepository.create({ id: 1, fee }));

      return fee;
    }

    return result.fee;
  }

  private async calculateFeeFromSettings(): Promise<number> {
    const feeSettings = await this.settingsService.getFeeSettings();

    if (feeSettings.fee_unit === FeeUnit.sats) {
      return feeSettings.fee_amount;
    }

    if (feeSettings.fee_unit === FeeUnit.cents && feeSettings.fee_amount) {
      const oneDollarInBtc = await this.getExchangeRate();

      if (oneDollarInBtc === null) {
        return DEFAULT_FEE;
      }

      const oneDollarInSats = oneDollarInBtc * SATS_IN_ONE_BITCOIN;
      const feeInSats = oneDollarInSats / feeSettings.fee_amount;

      // round to next higer multiple of 500
      const fee = Math.ceil(feeInSats / 500) * 500;

      return fee;
    }

    return DEFAULT_FEE;
  }

  private async getExchangeRate(): Promise<number | null> {
    const coinApiKey = this.configService.get<string>('COIN_API_KEY');

    if (!coinApiKey) {
      this.logger.warn(`COIN_API_KEY not set`);

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
      this.logger.warn(error, 'Could not get exchange rate');
    }

    return null;
  }
}
