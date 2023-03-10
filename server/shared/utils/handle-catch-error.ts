import { Logger } from '@nestjs/common';
import { Environment } from 'server/core/config/environment.enum';

export const handleCatchError = (error: unknown, logger: Logger, msg?: string) => {
  if (error instanceof Error) {
    if (process.env.NODE_ENV === Environment.Production) {
      delete error.stack;
    }

    logger.error(error, msg);
  }

  return error;
};
