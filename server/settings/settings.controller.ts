import { Body, Controller, Get, Logger, Post, UseGuards } from '@nestjs/common';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';
import { BasicGuard } from '../auth/basic.guard';
import { FeeAmountDto } from './dto/fee-amount.dto';
import { FeeUnitDto } from './dto/fee-unit.dto';
import { GetSettingsResponseDto } from './dto/get-settings-response.dto';
import { MaintenanceDto } from './dto/maintenance.dto';
import { SettingsKey } from './settings-key.enum';
import { SettingsService } from './settings.service';

@ApiTags('settings')
@UseGuards(BasicGuard)
@ApiBasicAuth()
@Controller('settings')
export class SettingsController {
  private logger = new Logger(SettingsController.name);
  constructor(private settingsService: SettingsService) {}

  @Get()
  public async getSettings(): Promise<GetSettingsResponseDto[]> {
    this.logger.verbose('getSettings');

    return await this.settingsService.getSettings();
  }

  @Post(SettingsKey.maintenance)
  public async setMaintenance(@Body() { value }: MaintenanceDto): Promise<void> {
    this.logger.verbose({ value }, 'setMaintenance');

    await this.settingsService.set({ key: SettingsKey.maintenance, value });
  }

  @Post(SettingsKey.fee_unit)
  public async setFeeUnit(@Body() { value }: FeeUnitDto): Promise<void> {
    this.logger.verbose({ value }, 'setFeeUnit');

    await this.settingsService.set({ key: SettingsKey.fee_unit, value });
  }

  @Post(SettingsKey.fee_amount)
  public async setFeeAmount(@Body() { value }: FeeAmountDto): Promise<void> {
    this.logger.verbose({ value }, 'setFeeAmount');

    await this.settingsService.set({
      key: SettingsKey.fee_amount,
      value: value.toString(),
    });
  }
}
