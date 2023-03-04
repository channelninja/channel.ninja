import { Controller, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { ChannelNinjaConfig } from 'server/core/config/configuration/channel-ninja.config';
import { Configuration } from 'server/core/config/configuration/configuration.enum';
import { FeesService } from '../fees/fees.service';
import { SettingsService } from '../settings/settings.service';
import { InitResponseDto } from './dto/init-response.dto';

@ApiTags('init')
@Controller('init')
export class InitController {
  constructor(
    private feesService: FeesService,
    private settingsService: SettingsService,
    private configService: ConfigService,
  ) {}

  @Post()
  public async init(): Promise<InitResponseDto> {
    const fee = await this.feesService.getFee();
    const maintenance = await this.settingsService.isMaintenanceMode();
    const { apiUrl } = this.configService.get<ChannelNinjaConfig>(Configuration.channelNinja);

    return { fee, maintenance, apiUrl };
  }
}
