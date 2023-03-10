import { NextFunction, Request, Response } from 'express';
import pinoHttp from 'pino-http';
import { Environment } from '../config/environment.enum';
import { formatters, pinoHttpPrintTarget } from './logger.utils';

const pinoLogger = pinoHttp({
  transport: process.env.NODE_ENV !== Environment.Production ? pinoHttpPrintTarget : undefined,
  formatters,
  messageKey: 'httpMsg',
});

export function logger(req: Request, res: Response, next: NextFunction) {
  pinoLogger(req, res);
  next();
}
