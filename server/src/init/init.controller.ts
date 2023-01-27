import { Controller, Post } from '@nestjs/common';
import { FeesService } from 'src/fees/fees.service';
import { SettingsService } from 'src/settings/settings.service';
import { InitResponseDto } from './dto/init-response.dto';

@Controller('init')
export class InitController {
  constructor(private feesService: FeesService, private settingsService: SettingsService) {}

  @Post()
  public async init(): Promise<InitResponseDto> {
    const fee = await this.feesService.getFee();
    const maintenance = await this.settingsService.isMaintenanceMode();

    return { fee, maintenance };
  }
}
