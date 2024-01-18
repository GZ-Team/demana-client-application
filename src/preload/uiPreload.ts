import { ipcRenderer } from 'electron';

import { sharedPreloadApi, attachApisToProcess } from './sharedPreload';

import type { DemanaSharedPreloadApi } from './sharedPreload';
import type { DemanaPrintingConfiguration } from 'types';

export type DemanaUiProcessPreloadApi = DemanaSharedPreloadApi & {
  // PRINTING
  setSelectedPrinter: (printerId: string | number | null) => void;
  setPrintingConfiguration: (printingConfiguration: DemanaPrintingConfiguration) => void;
};

const uiPreloadApi: DemanaUiProcessPreloadApi = {
  ...sharedPreloadApi,
  // PRINTING
  setSelectedPrinter: (printerId) => ipcRenderer.send('setSelectedPrinter', printerId),
  setPrintingConfiguration: (printingConfiguration) => ipcRenderer.send('setPrintingConfiguration', printingConfiguration)
};

attachApisToProcess({ api: uiPreloadApi });
