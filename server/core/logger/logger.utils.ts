import { join } from 'path';
import pino from 'pino';
import pinoCaller from 'pino-caller';

export const formatters = {
  level: (label: string, value: number) => {
    return { level: label, levelValue: value };
  },
};

export const level = process.env.LOG_LEVEL || 'trace';

export const pinoPrettyTarget: pino.TransportTargetOptions<Record<string, any>> = {
  target: 'pino-pretty',
  options: { singleLine: true },
  level,
};

export const pinoHttpPrintTarget: pino.TransportTargetOptions<Record<string, any>> = {
  target: 'pino-http-print',
  level,
  options: {},
};

export const productionLogger = pino({
  level,
  formatters,
});

export const developmentLogger = pinoCaller(
  pino({
    level,
    formatters,
    transport: pinoPrettyTarget,
  }),
  {
    stackAdjustment: 6,
    relativeTo: join(__dirname, '..', '..', '..'),
  },
);
