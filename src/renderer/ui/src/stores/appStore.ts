import { defineStore } from 'pinia';

import type { DemanaWindowState } from 'types';

type AppStoreState = {
  state: DemanaWindowState
}

export const useAppStore = defineStore('appStore', {
  state: (): AppStoreState => ({
    state: {
      isMaximized: false,
      isMinimized: false,
      isClosable: false,
      maximizable: false,
      minimizable: false
    }
  }),

  actions: {
    async minimizeWindow(): Promise<boolean> {
      try {
        return await window.api.minimizeWindow()
      } catch (exception) {
        throw new Error(`Failed to minimize this window: ${(exception as Error).message}`, { cause: exception });
      }
    },
    async maximizeWindow(): Promise<boolean> {
      try {
        return await window.api.maximizeWindow()
      } catch (exception) {
        throw new Error(`Failed to maximize this window: ${(exception as Error).message}`, { cause: exception });
      }
    },
    async restoreWindow(): Promise<boolean> {
      try {
        return await window.api.restoreWindow()
      } catch (exception) {
        throw new Error(`Failed to restore this window: ${(exception as Error).message}`, { cause: exception });
      }
    },
    async closeWindow(): Promise<boolean> {
      try {
        return await window.api.closeWindow()
      } catch (exception) {
        throw new Error(`Failed to close this window: ${(exception as Error).message}`, { cause: exception });
      }
    }
  }
});
