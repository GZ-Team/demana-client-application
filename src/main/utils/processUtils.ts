import { BrowserWindow } from 'electron';

export function getBrowserWindowByProcessId(processId: number): BrowserWindow {
  const process = BrowserWindow.fromId(processId);

  if (!process) {
    throw new Error(`the process for process id "${processId}" was not found.`);
  }

  return process;
}
