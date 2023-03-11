import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { DEFAULT_FEE } from '../fees/default-fee.constant';
import { FeeSettingsDto } from './dto/fee-settings.dto';
import { FeeUnit } from './dto/fee-unit.dto';
import { GetSettingsResponseDto } from './dto/get-settings-response.dto';
import { MaintenanceValue } from './dto/maintenance.dto';
import { Setting } from './setting.entity';
import { SettingsKey } from './settings-key.enum';

@Injectable()
export class SettingsService {
  private logger = new Logger(SettingsService.name);
  constructor(@InjectRepository(Setting) private settingsRepository: Repository<Setting>) {}

  public async getSettings(): Promise<GetSettingsResponseDto[]> {
    this.logger.verbose('getSettings');

    const settings = await this.settingsRepository.find();

    return settings;
  }

  public async set({ key, value }: { key: SettingsKey; value: string }): Promise<void> {
    this.logger.verbose({ key, value }, 'set');

    await this.settingsRepository.save({ key, value });
  }

  public async isMaintenanceMode(): Promise<boolean> {
    this.logger.verbose('isMaintenanceMode');

    const maintenanceSetting = await this.settingsRepository.findOne({ where: { key: SettingsKey.maintenance } });

    if (!maintenanceSetting) {
      return false;
    }

    return maintenanceSetting.value === MaintenanceValue.true;
  }

  public async getFeeSettings(): Promise<FeeSettingsDto> {
    this.logger.verbose('getFeeSettings');

    const defaultSettings: FeeSettingsDto = {
      [SettingsKey.fee_amount]: DEFAULT_FEE,
      [SettingsKey.fee_unit]: FeeUnit.sats,
    };

    const settings = await this.settingsRepository.find({
      where: { key: In([SettingsKey.fee_amount, SettingsKey.fee_unit]) },
    });

    settings.forEach(({ key, value }) => {
      if (key === SettingsKey.fee_amount) {
        defaultSettings[SettingsKey.fee_amount] = parseInt(value, 10);
      }

      if (key === SettingsKey.fee_unit) {
        defaultSettings[SettingsKey.fee_unit] = FeeUnit[value];
      }
    });

    return defaultSettings;
  }
}
