import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import * as winston from 'winston';
import * as path from 'node:path';
import * as fs from 'node:fs';
import 'winston-daily-rotate-file';

@Injectable()
export class LoggerService implements NestLoggerService {
  private logger: winston.Logger;
  private isDev: boolean;

  constructor() {
    this.isDev = process.env.NODE_ENV !== 'prod';

    const logDir = path.resolve(__dirname, '../../logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const transports: winston.transport[] = [];

    if (this.isDev) {
      // В dev-режиме логируем только в консоль
      transports.push(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.printf(({ level, message, timestamp, stack }) => {
              return stack
                ? `${timestamp} [${level}]: ${message}\n${stack}`
                : `${timestamp} [${level}]: ${message}`;
            }),
          ),
        }),
      );
    } else {
      // На проде создаём файлы с ротацией логов
      transports.push(
        new winston.transports.DailyRotateFile({
          filename: path.join(logDir, 'combined-%DATE%.log'),
          datePattern: 'YYYY-MM-DD',
          level: 'info',
          maxSize: '20m',
          maxFiles: '14d',
        }),
        new winston.transports.DailyRotateFile({
          filename: path.join(logDir, 'error-%DATE%.log'),
          datePattern: 'YYYY-MM-DD',
          level: 'error',
          maxSize: '20m',
          maxFiles: '14d',
        }),
      );
    }

    this.logger = winston.createLogger({
      level: this.isDev ? 'debug' : 'info',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json(),
      ),
      transports,
    });
  }

  log(message: string) {
    this.logger.info(message);
  }

  error(error: string | Error, trace?: string) {
    if (error instanceof Error) {
      this.logger.error(error.message, { stack: error.stack });
    } else {
      this.logger.error(error, trace ? { stack: trace } : undefined);
    }
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string) {
    if (this.isDev) {
      this.logger.debug(message);
    }
  }

  verbose(message: string) {
    if (this.isDev) {
      this.logger.verbose(message);
    }
  }
}
