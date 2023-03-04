import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { Environment } from './environment.enum';
import { DevelopmentEnvironmentVariables } from './validation.development';
import { ProductionEnvironmentVariables } from './validation.production';

// https://docs.nestjs.com/techniques/configuration#custom-validate-function

export const validate = (
  config: Record<string, unknown>,
): DevelopmentEnvironmentVariables | ProductionEnvironmentVariables => {
  let configToValidate: typeof DevelopmentEnvironmentVariables | typeof ProductionEnvironmentVariables;

  switch (process.env.NODE_ENV) {
    case Environment.Development:
      configToValidate = DevelopmentEnvironmentVariables;
      break;
    case Environment.Production:
      configToValidate = ProductionEnvironmentVariables;
      break;
    default:
      throw new Error('Invalid NODE_ENV');
  }

  const validatedConfig = plainToInstance(configToValidate, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
};
