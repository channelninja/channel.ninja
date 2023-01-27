import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { FeeSettingsDto } from './dto/fee-settings.dto';
import { FeeUnitValue } from './dto/fee-unit.dto';
import { MaintenanceValue } from './dto/maintenance.dto';
import { Setting } from './setting.entity';
import { SettingsKey } from './settings-key.enum';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting)
    private settingsRepository: Repository<Setting>,
  ) {}

  public async set({ key, value }: { key: SettingsKey; value: string }): Promise<void> {
    await this.settingsRepository.save({ key, value });
  }

  public async isMaintenanceMode(): Promise<boolean> {
    const maintenanceSetting = await this.settingsRepository.findOne({ where: { key: SettingsKey.maintenance } });

    return maintenanceSetting.value === MaintenanceValue.true;
  }

  public async getFeeSettings(): Promise<FeeSettingsDto> {
    const defaultSettings: FeeSettingsDto = {
      [SettingsKey.fee_amount]: 1000,
      [SettingsKey.fee_unit]: FeeUnitValue.sats,
    };

    const settings = await this.settingsRepository.find({
      where: { key: In([SettingsKey.fee_amount, SettingsKey.fee_unit]) },
    });

    settings.forEach(({ key, value }) => {
      if (key === SettingsKey.fee_amount) {
        defaultSettings[SettingsKey.fee_amount] = parseInt(value, 10);
      }

      if (key === SettingsKey.fee_unit) {
        defaultSettings[SettingsKey.fee_unit] = FeeUnitValue[value];
      }
    });

    return defaultSettings;
  }
}
