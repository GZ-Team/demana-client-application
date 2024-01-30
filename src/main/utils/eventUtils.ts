import type { BrowserWindow } from 'electron';
import type { DemanaEvent } from 'types';

export function pushEventToProcess<T>(event: DemanaEvent<T>, process: BrowserWindow): void {
  try {
    process.webContents.postMessage(event.name, event.value);
  } catch (exception) {
    throw new Error(
      `Failed to push an event to process '${process.title} [${process.id}]': ${
        (exception as Error).message
      }`
    );
  }
}
