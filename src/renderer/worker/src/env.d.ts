/// <reference types="vite/client" />

import type { DemanaWorkerProcessPreloadApi } from '../../../preload/workerPreload';

declare global {
  interface Window {
    electron: any;
    api: DemanaWorkerProcessPreloadApi;
  }
}
