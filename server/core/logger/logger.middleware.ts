import { NextFunction, Request, Response } from 'express';
import pinoHttp from 'pino-http';
import { Environment } from '../config/environment.enum';

const pinoLogger = pinoHttp({
  transport: process.env.NODE_ENV !== Environment.Production ? { target: 'pino-http-print' } : undefined,
});

export function logger(req: Request, res: Response, next: NextFunction) {
  pinoLogger(req, res);
  next();
}
