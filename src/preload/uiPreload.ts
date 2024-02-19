import { ipcRenderer } from 'electron'

import { sharedPreloadApi, attachApisToProcess } from './sharedPreload'

import type { DemanaSharedPreloadApi } from './sharedPreload'
import type { DemanaPreferences, DemanaPrintingConfiguration, Optional } from '@root/types'

export type DemanaUiProcessPreloadApi = DemanaSharedPreloadApi & {
  // APP DATA
  getAppId: () => Promise<string>;
  setAppId: (appId: string) => void;
  setVenueId: (venueId: string) => void;
  // PRINTING
  setSelectedPrinter: (printerId: string | number | null) => void;
  setPrintingConfiguration: (printingConfiguration: DemanaPrintingConfiguration) => void;
  // PREFERENCES
  setPreferences: (preferencesUpdate: Optional<DemanaPreferences, 'language'>) => void;
  // APP BEHAVIOUR
  '@window:external-navigation': (callback: (routeName: string) => void) => void;
  // AUTHENTICATION
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};

const uiPreloadApi: DemanaUiProcessPreloadApi = {
    ...sharedPreloadApi,
    // APP DATA
    getAppId: () => ipcRenderer.invoke('getAppId'),
    setAppId: (appId) => ipcRenderer.send('setAppId', appId),
    setVenueId: (venueId) => ipcRenderer.send('setVenueId', venueId),
    // PRINTING
    setSelectedPrinter: (printerId) => ipcRenderer.send('setSelectedPrinter', printerId),
    setPrintingConfiguration: (printingConfiguration) =>
        ipcRenderer.send('setPrintingConfiguration', printingConfiguration),
    // PREFERENCES
    setPreferences: (preferencesUpdate) => ipcRenderer.send('setPreferences', preferencesUpdate),
    // APP BEHAVIOUR
    '@window:external-navigation': (callback) =>
        ipcRenderer.on('@window:external-navigation', (_event, routeName: string) =>
            callback(routeName)
        ),
    // AUTHENTICATION
    refresh: async () => await ipcRenderer.invoke('refresh'),
    logout: async () => await ipcRenderer.invoke('logout')
}

attachApisToProcess({ api: uiPreloadApi })
