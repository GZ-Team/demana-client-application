import { defineStore } from 'pinia';

import type {
  DemanaLocaleCode,
  DemanaLocaleTranslation,
  DemanaLogLevel,
  DemanaPreferences,
  DemanaTemporaryDataDto,
  Optional
} from 'types';

type AppStoreState = {
  preferences: {
    language: DemanaPreferences['language'] | null;
  };
  i18n: {
    allTranslations: Record<DemanaLocaleCode, DemanaLocaleTranslation> | null;
    availableLocaleCodes: DemanaLocaleCode[] | null;
  };
  runtimeConfiguration: Record<string, unknown>;
};

export const useAppStore = defineStore('appStore', {
  state: (): AppStoreState => ({
    preferences: {
      language: null
    },
    i18n: {
      allTranslations: null,
      availableLocaleCodes: null
    },
    runtimeConfiguration: {}
  }),

  getters: {
    allTranslations: ({ i18n }): Record<DemanaLocaleCode, DemanaLocaleTranslation> =>
      i18n.allTranslations ?? ({} as Record<DemanaLocaleCode, DemanaLocaleTranslation>),
    availableLocaleCodes: ({ i18n }): DemanaLocaleCode[] => i18n.availableLocaleCodes ?? [],
    prefferedLocaleCode: ({ preferences }): DemanaLocaleCode => preferences.language ?? 'en'
  },

  actions: {
    async loadPreferences(): Promise<DemanaPreferences> {
      try {
        const preferences = await window.api.getPreferences();

        this.preferences = preferences;

        return this.preferences as DemanaPreferences;
      } catch (exception) {
        throw new Error(`Failed to load preferences: ${(exception as Error).message}`, {
          cause: exception
        });
      }
    },
    async loadTemporaryData(): Promise<Optional<DemanaTemporaryDataDto, 'redirectionRoute'>> {
      try {
        return await window.api.getTemporaryData();
      } catch (exception) {
        throw new Error(`Failed to load temporary data: ${(exception as Error).message}`, {
          cause: exception
        });
      }
    },
    async loadRuntimeConfiguration(): Promise<Record<string, unknown>> {
      try {
        this.runtimeConfiguration = await window.api.getRuntimeConfiguration();
        return this.runtimeConfiguration;
      } catch (exception) {
        throw new Error(`Failed to load runtime configuration: ${(exception as Error).message}`, {
          cause: exception
        });
      }
    },
    updateTemporaryData(key: keyof DemanaTemporaryDataDto, value: string | null): void {
      try {
        window.api.setTemporaryData(key, value);
      } catch (exception) {
        throw new Error(
          `Failed to update temporary data for the key "${key}": ${(exception as Error).message}`,
          { cause: exception }
        );
      }
    },
    async updatePreferences(
      preferencesUpdate: Optional<DemanaPreferences, 'language'>
    ): Promise<DemanaPreferences> {
      try {
        window.api.setPreferences(preferencesUpdate);
        return await this.loadPreferences();
      } catch (exception) {
        throw new Error(`Failed to update preferences: ${(exception as Error).message}`, {
          cause: exception
        });
      }
    },
    async loadAllTranslations(): Promise<Record<DemanaLocaleCode, DemanaLocaleTranslation>> {
      try {
        this.i18n.allTranslations = await window.api.getAllTranslations();
        return this.i18n.allTranslations;
      } catch (exception) {
        throw new Error(`Failed to load all translations: ${(exception as Error).message}`, {
          cause: exception
        });
      }
    },
    async loadAvailableLocaleCodes(): Promise<DemanaLocaleCode[]> {
      try {
        this.i18n.availableLocaleCodes = await window.api.getAvailableLocaleCodes();
        return this.i18n.availableLocaleCodes;
      } catch (exception) {
        throw new Error(
          `Failed to load all available locale codes: ${(exception as Error).message}`,
          { cause: exception }
        );
      }
    },
    logMessage(
      { service, level }: { service: string; level: DemanaLogLevel },
      message: string,
      ...meta: unknown[]
    ): void {
      try {
        window.api.log({ service, level }, message, ...meta);
      } catch (exception) {
        throw new Error(`Failed to log a message: ${(exception as Error).message}`, {
          cause: exception
        });
      }
    }
  }
});
