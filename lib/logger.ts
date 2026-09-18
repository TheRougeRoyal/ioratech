import pino from 'pino';

// ponytail: Use pino-pretty only in development for readability
const transport = process.env.NODE_ENV === 'development'
  ? {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    }
  : undefined;

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport,
});
