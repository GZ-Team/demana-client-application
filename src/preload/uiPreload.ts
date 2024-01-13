import { ipcRenderer } from 'electron';

import { sharedPreloadApi, attachApisToProcess } from './sharedPreload';

import type { DemanaSharedPreloadApi } from './sharedPreload';

export type DemanaUiProcessPreloadApi = DemanaSharedPreloadApi & {
  setSelectedPrinter: (printerId: string | number) => void;
};

const uiPreloadApi: DemanaUiProcessPreloadApi = {
  ...sharedPreloadApi,
  setSelectedPrinter: (printerId) => ipcRenderer.send('setSelectedPrinter', printerId)
};

attachApisToProcess({ api: uiPreloadApi });
