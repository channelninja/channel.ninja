import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsModule } from 'src/settings/settings.module';
import { Fee } from './fee.entity';
import { FeesService } from './fees.service';

@Module({
  imports: [SettingsModule, ConfigModule, HttpModule, TypeOrmModule.forFeature([Fee])],
  providers: [FeesService],
  exports: [FeesService],
})
export class FeesModule {}
