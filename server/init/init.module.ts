import { Module } from '@nestjs/common';
import { FeesModule } from '../fees/fees.module';
import { SettingsModule } from '../settings/settings.module';
import { InitController } from './init.controller';

@Module({
  imports: [FeesModule, SettingsModule],
  controllers: [InitController],
})
export class InitModule {}
