import { ElectronAPI } from '@electron-toolkit/preload'

import type { DemanaWorkerProcessPreloadApi } from '../../../preload/workerPreload'

declare global {
  interface Window {
    electron: ElectronAPI;
    api: DemanaWorkerProcessPreloadApi;
  }
}
