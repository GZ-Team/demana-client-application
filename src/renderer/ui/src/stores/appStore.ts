import { defineStore } from 'pinia';

import type { DemanaLocaleCode, DemanaLocaleTranslation, DemanaPreferences, DemanaWindowState, Optional } from 'types';

type AppStoreState = {
  state: DemanaWindowState,
  preferences: {
    language: DemanaPreferences["language"] | null
  },
  i18n: {
    allTranslations: Record<DemanaLocaleCode, DemanaLocaleTranslation> | null,
    availableLocaleCodes: DemanaLocaleCode[] | null
  }
}

export const useAppStore = defineStore('appStore', {
  state: (): AppStoreState => ({
    state: {
      isMaximized: false,
      isMinimized: false,
      isClosable: false,
      maximizable: false,
      minimizable: false
    },
    preferences: {
      language: null
    },
    i18n: {
      allTranslations: null,
      availableLocaleCodes: null
    }
  }),

  getters: {
    allTranslations: ({ i18n }): Record<DemanaLocaleCode, DemanaLocaleTranslation> => i18n.allTranslations ?? {} as Record<DemanaLocaleCode, DemanaLocaleTranslation>,
    availableLocaleCodes: ({ i18n }): DemanaLocaleCode[] => i18n.availableLocaleCodes ?? [],
    prefferedLocaleCode: ({ preferences }): DemanaLocaleCode => preferences.language ?? 'en'
  },

  actions: {
    async loadPreferences(): Promise<DemanaPreferences> {
      try {
        const preferences = await window.api.getPreferences()

        this.preferences = preferences

        return this.preferences as DemanaPreferences
      } catch (exception) {
        throw new Error(`Failed to load preferences: ${(exception as Error).message}`, { cause: exception });
      }
    },
    async updatePreferences(preferencesUpdate: Optional<DemanaPreferences, 'language'>): Promise<DemanaPreferences> {
      try {
        window.api.setPreferences(preferencesUpdate)
        return await this.loadPreferences()
      } catch (exception) {
        throw new Error(`Failed to update preferences: ${(exception as Error).message}`, { cause: exception });
      }
    },
    async loadAllTranslations(): Promise<Record<DemanaLocaleCode, DemanaLocaleTranslation>> {
      try {
        this.i18n.allTranslations = await window.api.getAllTranslations()
        return this.i18n.allTranslations
      } catch (exception) {
        throw new Error(`Failed to load all translations: ${(exception as Error).message}`, { cause: exception });
      }
    },
    async loadAvailableLocaleCodes(): Promise<DemanaLocaleCode[]> {
      try {
        this.i18n.availableLocaleCodes = await window.api.getAvailableLocaleCodes()
        return this.i18n.availableLocaleCodes
      } catch (exception) {
        throw new Error(`Failed to load all available locale codes: ${(exception as Error).message}`, { cause: exception });
      }
    },
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
