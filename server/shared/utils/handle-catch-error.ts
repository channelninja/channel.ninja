import { Logger } from '@nestjs/common';
import { Environment } from 'server/core/config/environment.enum';

export const handleCatchError = (error: unknown, logger: Logger, msg?: string) => {
  if (typeof error === 'string') {
    logger.error({ err: { message: error } }, msg);

    return;
  }

  if (typeof error === 'object') {
    if ('stack' in error && process.env.NODE_ENV === Environment.Production) {
      delete error.stack;
    }
  }

  logger.error(error, msg);

  return error;
};
