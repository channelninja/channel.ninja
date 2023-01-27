import { SettingsKey } from '../settings-key.enum';
import { FeeUnitValue } from './fee-unit.dto';

export class FeeSettingsDto {
  public [SettingsKey.fee_amount]: number;

  public [SettingsKey.fee_unit]: FeeUnitValue;
}
