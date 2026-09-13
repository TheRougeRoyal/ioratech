type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private level: LogLevel = 'info';

  setLevel(level: LogLevel) {
    this.level = level;
  }

  private shouldLog(level: LogLevel) {
    const levels: Record<LogLevel, number> = { debug: 0, info: 1, warn: 2, error: 3 };
    return levels[level] >= levels[this.level];
  }

  info(msg: string, meta?: any) {
    if (this.shouldLog('info')) console.log(`[INFO] ${new Date().toISOString()} - ${msg}`, meta || '');
  }

  warn(msg: string, meta?: any) {
    if (this.shouldLog('warn')) console.warn(`[WARN] ${new Date().toISOString()} - ${msg}`, meta || '');
  }

  error(msg: string, error?: any, meta?: any) {
    if (this.shouldLog('error')) {
      console.error(`[ERROR] ${new Date().toISOString()} - ${msg}`, {
        error: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined,
        ...meta,
      });
    }
  }

  debug(msg: string, meta?: any) {
    if (this.shouldLog('debug')) console.debug(`[DEBUG] ${new Date().toISOString()} - ${msg}`, meta || '');
  }
}

export const logger = new Logger();
