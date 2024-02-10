import { createLogger, format, transports, addColors } from 'winston';
import WinstonDailyRotateFile from 'winston-daily-rotate-file';

import { resolveAppFilePath } from './fileUtils';

import type { Logger } from 'winston';
import type { DemanaLogLevel } from '@root/types';

const { combine, splat, timestamp, simple, label, colorize, json, printf, prettyPrint } = format;

const logFilePath: string = resolveAppFilePath('logs');

const messageFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} ${label ? `[${label}]` : ''} ${level}: ${message}`;
});

const loggerOptions: {
  levels: Record<DemanaLogLevel, number>;
  colors: Record<DemanaLogLevel, string | string[]>;
} = {
  levels: {
    crit: 0,
    error: 1,
    warning: 2,
    info: 3,
    debug: 4
  },
  colors: {
    crit: 'bold red blackBG',
    error: 'bold red',
    warning: 'yellow',
    info: 'blue',
    debug: 'italic green'
  }
};

addColors(loggerOptions.colors);

const rootLogger: Logger = createLogger({ levels: loggerOptions.levels });
const serviceLoggers: Record<string, Logger> = {};

export default function useLogger(options?: { service: string; isMainProcess?: boolean }): {
  logger: Logger;
} {
  const { service, isMainProcess } = options || {};

  function createChildLogger(serviceName: string): Logger {
    try {
      const childLogger = rootLogger.child({});

      const consoleTransport = new transports.Console({
        format: combine(
          colorize(),
          timestamp(),
          label({ label: serviceName }),
          simple(),
          splat(),
          messageFormat
        )
      });

      const fileTransport = new WinstonDailyRotateFile({
        filename: '%DATE%.log',
        dirname: logFilePath,
        datePattern: 'YYYYMMDD',
        maxFiles: '14d',
        format: combine(timestamp(), label({ label: serviceName }), json(), prettyPrint()),
        level: 'info'
      });

      childLogger.add(consoleTransport);
      childLogger.add(fileTransport);

      return childLogger;
    } catch (exception) {
      throw new Error(`Failed to create a child Logger instance: ${(exception as Error).message}`, {
        cause: exception
      });
    }
  }

  function getOrCreateServiceLogger(serviceName?: string, isMainProcess = true): Logger {
    try {
      serviceName =
        isMainProcess || !serviceName
          ? `Main${serviceName ? `: ${serviceName}` : ''}`
          : serviceName;

      if (!serviceLoggers[serviceName]) {
        serviceLoggers[serviceName] = createChildLogger(serviceName);
      }

      return serviceLoggers[serviceName];
    } catch (exception) {
      throw new Error(
        `Failed to get or create the service Logger instance for the service "${serviceName}": ${
          (exception as Error).message
        }`,
        { cause: exception }
      );
    }
  }

  return {
    logger: getOrCreateServiceLogger(service, isMainProcess)
  };
}

useLogger().logger.info(`Using a Logger that writes logs to the folder '${logFilePath}'.`);
