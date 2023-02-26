import { Controller, InternalServerErrorException, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FeesService } from '../fees/fees.service';
import { SettingsService } from '../settings/settings.service';
import { InitResponseDto } from './dto/init-response.dto';

@ApiTags('init')
@Controller('init')
export class InitController {
  constructor(private feesService: FeesService, private settingsService: SettingsService) {}

  @Post()
  public async init(): Promise<InitResponseDto> {
    const fee = await this.feesService.getFee();
    const maintenance = await this.settingsService.isMaintenanceMode();

    if (!process.env.API_URL) {
      throw new InternalServerErrorException('API_URL not defined');
    }

    return { fee, maintenance, apiUrl: process.env.API_URL };
  }
}
