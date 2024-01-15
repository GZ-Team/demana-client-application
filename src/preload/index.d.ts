import { ElectronAPI } from '@electron-toolkit/preload';

import type { DemanaPreloadApi } from './sharedPreload';
import type { DemanaUiProcessPreloadApi } from './uiPreload';
import type { DemanaWorkerProcessPreloadApi } from './workerPreload';

declare global {
  interface Window {
    electron: ElectronAPI;
    api: DemanaUiProcessPreloadApi & DemanaWorkerProcessPreloadApi;
  }
}
