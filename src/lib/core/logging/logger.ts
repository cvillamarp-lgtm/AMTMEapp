import pino, { Logger, LoggerOptions } from 'pino';
import { AppError } from '../errors/AppError';

export interface LogContext {
  requestId?: string;
  userId?: string;
  endpoint?: string;
  duration?: number;
  userAgent?: string;
  ipAddress?: string;
  severity?: string;
  metadata?: Record<string, unknown>;
}

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

class LoggerService {
  private logger: Logger;

  constructor() {
    const options: LoggerOptions = {
      level: process.env.LOG_LEVEL || 'info',
      transport:
        process.env.NODE_ENV === 'development'
          ? {
              target: 'pino-pretty',
              options: {
                colorize: true,
                translateTime: 'SYS:standard',
                ignore: 'pid,hostname',
              },
            }
          : undefined,
      serializers: {
        req: pino.stdSerializers.req,
        res: pino.stdSerializers.res,
        err: pino.stdSerializers.err,
      },
      base: {
        service: 'amtme-studio-os',
        environment: process.env.NODE_ENV || 'development',
        version: process.env.APP_VERSION || '1.0.0',
      },
    };

    this.logger = pino(options);
  }

  debug(message: string, context?: LogContext): void {
    this.logger.debug({ ...context }, message);
  }

  info(message: string, context?: LogContext): void {
    this.logger.info({ ...context }, message);
  }

  warn(message: string, context?: LogContext): void {
    this.logger.warn({ ...context }, message);
  }

  error(message: string, error?: Error | AppError, context?: LogContext): void {
    const errorObj = error instanceof Error ? error : new Error(message);
    this.logger.error(
      {
        ...context,
        error: {
          message: errorObj.message,
          stack: errorObj.stack,
          code: error instanceof AppError ? error.code : 'UNKNOWN',
          severity: error instanceof AppError ? error.severity : 'high',
        },
      },
      message
    );
  }

  fatal(message: string, error?: Error, context?: LogContext): void {
    const errorObj = error instanceof Error ? error : new Error(message);
    this.logger.fatal(
      {
        ...context,
        error: {
          message: errorObj.message,
          stack: errorObj.stack,
        },
      },
      message
    );
  }

  performance(operation: string, duration: number, context?: LogContext): void {
    const threshold = 1000; // ms
    const level = duration > threshold ? 'warn' : 'debug';

    this.logger[level](
      {
        ...context,
        operation,
        duration,
        slow: duration > threshold,
      },
      `Operation completed: ${operation}`
    );
  }

  request(method: string, path: string, context?: LogContext): void {
    this.logger.info(
      {
        ...context,
        method,
        path,
      },
      `Incoming request`
    );
  }

  response(
    method: string,
    path: string,
    statusCode: number,
    duration: number,
    context?: LogContext
  ): void {
    const level = statusCode >= 400 ? 'warn' : 'info';
    this.logger[level](
      {
        ...context,
        method,
        path,
        statusCode,
        duration,
      },
      `Request completed`
    );
  }

  getLogger(): Logger {
    return this.logger;
  }
}

export const logger = new LoggerService();
