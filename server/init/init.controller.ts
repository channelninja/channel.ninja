import { Controller, Logger, Post } from '@nestjs/common';
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
  private logger = new Logger(InitController.name);
  constructor(
    private feesService: FeesService,
    private settingsService: SettingsService,
    private configService: ConfigService,
  ) {}

  @Post()
  public async init(): Promise<InitResponseDto> {
    this.logger.verbose('init');
    const fee = await this.feesService.getFee();
    const maintenance = await this.settingsService.isMaintenanceMode();
    const { apiUrl, txExplorerUrl } = this.configService.get<ChannelNinjaConfig>(Configuration.channelNinja);

    return { fee, maintenance, apiUrl, txExplorerUrl };
  }
}
