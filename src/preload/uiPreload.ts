import { ipcRenderer } from 'electron';

import { sharedPreloadApi, attachApisToProcess } from './sharedPreload';

import type { DemanaSharedPreloadApi } from './sharedPreload';
import type { DemanaPreferences, DemanaPrintingConfiguration, Optional } from 'types';

export type DemanaUiProcessPreloadApi = DemanaSharedPreloadApi & {
  // PRINTING
  setSelectedPrinter: (printerId: string | number | null) => void;
  setPrintingConfiguration: (printingConfiguration: DemanaPrintingConfiguration) => void;
  // PREFERENCES
  setPreferences: (preferencesUpdate: Optional<DemanaPreferences, 'language'>) => void;
  // APP BEHAVIOUR
  '@window:external-navigation': (callback: (routeName: string) => {}) => void;
};

const uiPreloadApi: DemanaUiProcessPreloadApi = {
  ...sharedPreloadApi,
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
    )
};

attachApisToProcess({ api: uiPreloadApi });
