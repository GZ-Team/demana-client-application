import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';

import type { DemanaLocaleCode, DemanaLocaleTranslation, DemanaMessage, DemanaPreferences, DemanaPrintingConfiguration, DemanaWindowState } from 'types';

export interface DemanaPreloadApi { }

export type DemanaSharedPreloadApi = DemanaPreloadApi & {
  // MESSAGES
  sendMessage: (message: DemanaMessage) => void;
  '@messages:new': (callback: (message: DemanaMessage) => {}) => void;
  // PRINTING
  getSelectedPrinter: () => Promise<string | number | null>;
  getPrintingConfiguration: () => Promise<DemanaPrintingConfiguration>;
  // PREFERENCES
  getPreferences: () => Promise<DemanaPreferences>;
  // I18N
  getAvailableLocaleCodes: () => Promise<DemanaLocaleCode[]>;
  getAllTranslations: () => Promise<Record<DemanaLocaleCode, DemanaLocaleTranslation>>;
  // ORDERS
  '@orders:new': (callback: (order: unknown) => {}) => void;
  // APP BEHAVIOUR
  minimizeWindow: () => Promise<boolean>;
  maximizeWindow: () => Promise<boolean>;
  restoreWindow: () => Promise<boolean>;
  closeWindow: () => Promise<boolean>;
  '@window:new': (callback: (state: DemanaWindowState) => {}) => void;
};

export const sharedPreloadApi: DemanaSharedPreloadApi = {
  // MESSAGES
  sendMessage: (message) => ipcRenderer.send('sendMessage', message),
  '@messages:new': (callback) => ipcRenderer.on('@messages:new', (_event, value: DemanaMessage) => callback(value)),
  // PRINTING
  getSelectedPrinter: () => ipcRenderer.invoke('getSelectedPrinter'),
  getPrintingConfiguration: () => ipcRenderer.invoke('getPrintingConfiguration'),
  // PREFERENCES
  getPreferences: () => ipcRenderer.invoke('getPreferences'),
  // I18N
  getAvailableLocaleCodes: () => ipcRenderer.invoke('getAvailableLocaleCodes'),
  getAllTranslations: () => ipcRenderer.invoke('getAllTranslations'),
  // ORDERS
  '@orders:new': (callback) => ipcRenderer.on('@orders:new', (_event, value: unknown) => callback(value)),
  // APP BEHAVIOUR
  minimizeWindow: () => ipcRenderer.invoke('minimizeWindow'),
  maximizeWindow: () => ipcRenderer.invoke('maximizeWindow'),
  restoreWindow: () => ipcRenderer.invoke('restoreWindow'),
  closeWindow: () => ipcRenderer.invoke('closeWindow'),
  '@window:new': (callback) => ipcRenderer.on('@window:new', (_event, value: DemanaWindowState) => callback(value))
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
