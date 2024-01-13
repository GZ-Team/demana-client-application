import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';

import type { DemanaLocaleTranslationDto, DemanaMessage } from 'types';

export interface DemanaPreloadApi {}

export type DemanaSharedPreloadApi = DemanaPreloadApi & {
  sendMessage: (message: DemanaMessage) => void;
  getSelectedPrinter: () => Promise<string>;
  getAvailableLocaleCodes: () => Promise<string[]>;
  getLocaleTranslations: () => Promise<DemanaLocaleTranslationDto>;
  '@orders:new': (callback: Function) => void;
  '@messages:new': (callback: Function) => void;
};

export const sharedPreloadApi: DemanaSharedPreloadApi = {
  sendMessage: (message) => ipcRenderer.send('sendMessage', message),
  getSelectedPrinter: () => ipcRenderer.invoke('getSelectedPrinter'),
  getAvailableLocaleCodes: () => ipcRenderer.invoke('getAvailableLocaleCodes'),
  getLocaleTranslations: () => ipcRenderer.invoke('getLocaleTranslations'),
  '@orders:new': (callback) => ipcRenderer.on('@orders:new', (_event, value) => callback(value)),
  '@messages:new': (callback) => ipcRenderer.on('@messages:new', (_event, value) => callback(value))
};

export function attachApisToProcess(
  apis: Record<string, DemanaPreloadApi> = {},
  options: { addElectronApi: boolean } = { addElectronApi: true }
): void {
  try {
    let apisToAdd = apis;

    if (options.addElectronApi) {
      apisToAdd = { ...apis, electron: electronAPI };
    }

    Object.entries(apisToAdd).forEach(([apiKey, api]) =>
      contextBridge.exposeInMainWorld(apiKey, api)
    );
  } catch (exception) {
    console.error(`Failed to expose API's to main world of a process: ${exception}`);
  }
}
