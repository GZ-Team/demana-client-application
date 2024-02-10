import { useAppStore } from '@ui/stores/appStore';

import type { DemanaLogLevel, DemanaLogger } from '@root/types';

export default function useLogger({ service }: { service: string }): DemanaLogger {
  const { logMessage } = useAppStore();

  function log(level: DemanaLogLevel, message: string, ...meta: unknown[]): void {
    try {
      logMessage({ service: `UI: ${service}`, level }, message, ...meta);
    } catch (exception) {
      throw new Error(`Failed to log a message: ${(exception as Error).message}`, {
        cause: exception
      });
    }
  }

  return {
    crit: (message: string, ...meta: unknown[]) => log('crit', message, ...meta),
    error: (message: string, ...meta: unknown[]) => log('error', message, ...meta),
    warning: (message: string, ...meta: unknown[]) => log('warning', message, ...meta),
    info: (message: string, ...meta: unknown[]) => log('info', message, ...meta),
    debug: (message: string, ...meta: unknown[]) => log('debug', message, ...meta)
  };
}
