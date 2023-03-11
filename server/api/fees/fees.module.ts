import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsModule } from '../settings/settings.module';
import { Fee } from './fee.entity';
import { FeesController } from './fees.controller';
import { FeesService } from './fees.service';

@Module({
  imports: [SettingsModule, ConfigModule, HttpModule, TypeOrmModule.forFeature([Fee])],
  providers: [FeesService],
  exports: [FeesService],
  controllers: [FeesController],
})
export class FeesModule {}
