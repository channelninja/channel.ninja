import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SettingsModule } from 'src/settings/settings.module';
import { FeesService } from './fees.service';

@Module({
  imports: [SettingsModule, ConfigModule, HttpModule],
  providers: [FeesService],
  exports: [FeesService],
})
export class FeesModule {}
