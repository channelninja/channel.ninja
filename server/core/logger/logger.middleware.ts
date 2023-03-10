import { NextFunction, Request, Response } from 'express';
import pinoHttp from 'pino-http';
import { Environment } from '../config/environment.enum';
import { formatters } from './logger.utils';

const pinoLogger = pinoHttp({
  transport: process.env.NODE_ENV !== Environment.Production ? { target: 'pino-http-print' } : undefined,
  formatters,
});

export function logger(req: Request, res: Response, next: NextFunction) {
  pinoLogger(req, res);
  next();
}
