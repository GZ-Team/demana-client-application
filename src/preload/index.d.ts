import { ElectronAPI } from '@electron-toolkit/preload'

import { DemanaClientApi } from './index';

declare global {
  interface Window {
    electron: ElectronAPI
    api: DemanaClientApi
  }
}
