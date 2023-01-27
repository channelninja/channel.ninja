import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';
import { BasicGuard } from 'src/auth/basic.guard';
import { FeeAmountDto } from './dto/fee-amount.dto';
import { FeeUnitDto } from './dto/fee-unit.dto';
import { MaintenanceDto } from './dto/maintenance.dto';
import { SettingsKey } from './settings-key.enum';
import { SettingsService } from './settings.service';

@ApiTags('settings')
@UseGuards(BasicGuard)
@ApiBasicAuth()
@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Post(SettingsKey.maintenance)
  public async setMaintenance(@Body() { value }: MaintenanceDto): Promise<void> {
    await this.settingsService.set({ key: SettingsKey.maintenance, value });
  }

  @Post(SettingsKey.fee_unit)
  public async setFeeUnit(@Body() { value }: FeeUnitDto): Promise<void> {
    await this.settingsService.set({ key: SettingsKey.fee_unit, value });
  }

  @Post(SettingsKey.fee_amount)
  public async setFeeAmount(@Body() { value }: FeeAmountDto): Promise<void> {
    await this.settingsService.set({
      key: SettingsKey.fee_amount,
      value: value.toString(),
    });
  }
}
