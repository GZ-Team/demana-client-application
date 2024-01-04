import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

import type { DemanaLocaleTranslation } from 'types'

export type DemanaClientApi = {
  setSelectedPrinter: (printerId: string | number) => void
  getAvailableLocaleCodes: () => Promise<string[]>
  getLocaleTranslations: () => Promise<DemanaLocaleTranslation>
}

// Custom APIs for renderer
const api: DemanaClientApi = {
  setSelectedPrinter: (printerId: string | number) => ipcRenderer.send('setSelectedPrinter', printerId),
  getAvailableLocaleCodes: () => ipcRenderer.invoke('getAvailableLocaleCodes'),
  getLocaleTranslations: () => ipcRenderer.invoke('getLocaleTranslations')
}

try {
  contextBridge.exposeInMainWorld('electron', electronAPI)
  contextBridge.exposeInMainWorld('api', api)
} catch (exception) {
  console.error(`Failed to expose API's to main world: ${exception}`)
}