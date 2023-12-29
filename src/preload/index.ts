import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

export type DemanaClientApi = {
  setSelectedPrinter: (printerId: string | number) => void
}

// Custom APIs for renderer
const api: DemanaClientApi = {
  setSelectedPrinter: (printerId: string | number): void => ipcRenderer.send('setSelectedPrinter', printerId)
}

try {
  contextBridge.exposeInMainWorld('electron', electronAPI)
  contextBridge.exposeInMainWorld('api', api)
} catch (error) {
  console.error(error)
}