import pinoPretty from 'pino-pretty';

const pinoPrettyTarget = (opts: Record<string, any>) =>
  pinoPretty({
    ...opts,
    messageFormat: (log, messageKey) => {
      if (log.req && log.res) {
        const req = log.req as { method: string; url: string };
        const res = log.res as { statusCode: number };

        return `${req.method} ${req.url} ${res.statusCode} - ${log.responseTime}ms`;
      }

      return `[${log.namespace}]: ${log[messageKey]}`;
    },
  });

export default pinoPrettyTarget;
