import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

import type {
    DemanaLocaleCode,
    DemanaLocaleTranslation,
    DemanaMessage,
    DemanaPreferences,
    DemanaPrintingConfiguration,
    DemanaTemporaryDataDto,
    Optional
} from '@root/types'

export interface DemanaPreloadApi {}

export type DemanaSharedPreloadApi = DemanaPreloadApi & {
  // MESSAGES
  sendMessage: (message: DemanaMessage) => void;
  '@messages:new': (callback: (message: DemanaMessage) => void) => void;
  // PRINTING
  getSelectedPrinter: () => Promise<string | number | null>;
  getPrintingConfiguration: () => Promise<DemanaPrintingConfiguration>;
  // PREFERENCES
  getPreferences: () => Promise<DemanaPreferences>;
  // TEMPORARY
  getTemporaryData: () => Promise<Optional<DemanaTemporaryDataDto, 'redirectionRoute'>>;
  setTemporaryData: (key: keyof DemanaTemporaryDataDto, value: string | null) => void;
  // I18N
  getAvailableLocaleCodes: () => Promise<DemanaLocaleCode[]>;
  getAllTranslations: () => Promise<Record<DemanaLocaleCode, DemanaLocaleTranslation>>;
  // APP BEHAVIOUR
  openExternalLink: (link: string) => Promise<void>;
  // SESSION
  '@session:authenticated': (callback: (authenticated: boolean) => void) => void;
  // ORDERS
  '@orders:new': (callback: (order: unknown) => void) => void;
  // LOGGING
  log: (
    { level, service }: { level: string; service: string },
    message: string,
    ...meta: unknown[]
  ) => void;
};

export const sharedPreloadApi: DemanaSharedPreloadApi = {
    // MESSAGES
    sendMessage: (message) => ipcRenderer.send('sendMessage', message),
    '@messages:new': (callback) =>
        ipcRenderer.on('@messages:new', (_event, message: DemanaMessage) => callback(message)),
    // PRINTING
    getSelectedPrinter: () => ipcRenderer.invoke('getSelectedPrinter'),
    getPrintingConfiguration: () => ipcRenderer.invoke('getPrintingConfiguration'),
    // PREFERENCES
    getPreferences: () => ipcRenderer.invoke('getPreferences'),
    // TEMPORARY DATA
    getTemporaryData: () => ipcRenderer.invoke('getTemporaryData'),
    setTemporaryData: (key, value) => ipcRenderer.send('setTemporaryData', { key, value }),
    // I18N
    getAvailableLocaleCodes: () => ipcRenderer.invoke('getAvailableLocaleCodes'),
    getAllTranslations: () => ipcRenderer.invoke('getAllTranslations'),
    // APP BEHAVIOUR
    openExternalLink: async (link: string) => ipcRenderer.send('openExternalLink', link),
    // SESSION
    '@session:authenticated': (callback) =>
        ipcRenderer.on('@session:authenticated', (_event, authenticated: boolean) =>
            callback(authenticated)
        ),
    // ORDERS
    '@orders:new': (callback) =>
        ipcRenderer.on('@orders:new', (_event, order: unknown) => callback(order)),
    // LOGGING
    log: ({ level, service }, message, ...meta) =>
        ipcRenderer.send('log', { message, meta, level, service })
}

export function attachApisToProcess(
    apis: Record<string, DemanaPreloadApi> = {},
    options: { addElectronApi: boolean } = { addElectronApi: true }
): void {
    try {
        let apisToAdd = apis

        if (options.addElectronApi) {
            apisToAdd = { ...apis, electron: electronAPI }
        }

        Object.entries(apisToAdd).forEach(([apiKey, api]) =>
            contextBridge.exposeInMainWorld(apiKey, api)
        )
    } catch (exception) {
        console.error(`Failed to expose API's to main world of a process: ${exception}`)
    }
}
