import { Module } from '@nestjs/common';
import { FeesModule } from 'src/fees/fees.module';
import { SettingsModule } from 'src/settings/settings.module';
import { InitController } from './init.controller';

@Module({
  imports: [FeesModule, SettingsModule],
  controllers: [InitController],
})
export class InitModule {}
