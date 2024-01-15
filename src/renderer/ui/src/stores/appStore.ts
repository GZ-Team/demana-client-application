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
  })
});
