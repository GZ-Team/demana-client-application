import { defineStore } from 'pinia'

import type {
    DemanaLocaleCode,
    DemanaLocaleTranslation,
    DemanaLogLevel,
    DemanaPreferences,
    DemanaTemporaryDataDto,
    Optional
} from '@root/types'

type AppStoreState = {
  appId: string | null,
  preferences: {
    language: DemanaPreferences['language'] | null;
  };
  i18n: {
    allTranslations: Record<DemanaLocaleCode, DemanaLocaleTranslation> | null;
    availableLocaleCodes: DemanaLocaleCode[] | null;
  };
};

export const useAppStore = defineStore('appStore', {
    state: (): AppStoreState => ({
        appId: null,
        preferences: {
            language: null
        },
        i18n: {
            allTranslations: null,
            availableLocaleCodes: null
        }
    }),

    getters: {
        allTranslations: ({ i18n }): Record<DemanaLocaleCode, DemanaLocaleTranslation> =>
            i18n.allTranslations ?? ({} as Record<DemanaLocaleCode, DemanaLocaleTranslation>),
        availableLocaleCodes: ({ i18n }): DemanaLocaleCode[] => i18n.availableLocaleCodes ?? [],
        preferredLocaleCode: ({ preferences }): DemanaLocaleCode => preferences.language ?? 'en',
        runtimeConfiguration: () => import.meta.env
    },

    actions: {
        async getAppId(): Promise<string> {
            try {
                this.appId = await window.api.getAppId()

                return this.appId
            } catch (exception) {
                throw new Error(`Failed to get the application id: ${(exception as Error).message}`, {
                    cause: exception
                })
            }
        },
        async setAppId(newAppId: string): Promise<void> {
            try {
                window.api.setAppId(newAppId)
                await this.getAppId()
            } catch (exception) {
                throw new Error(`Failed to set the application id: ${(exception as Error).message}`, {
                    cause: exception
                })
            }
        },
        async loadPreferences(): Promise<DemanaPreferences> {
            try {
                this.preferences = await window.api.getPreferences()

                return this.preferences as DemanaPreferences
            } catch (exception) {
                throw new Error(`Failed to load preferences: ${(exception as Error).message}`, {
                    cause: exception
                })
            }
        },
        async loadTemporaryData(): Promise<Optional<DemanaTemporaryDataDto, 'redirectionRoute'>> {
            try {
                return await window.api.getTemporaryData()
            } catch (exception) {
                throw new Error(`Failed to load temporary data: ${(exception as Error).message}`, {
                    cause: exception
                })
            }
        },
        updateTemporaryData(key: keyof DemanaTemporaryDataDto, value: string | null): void {
            try {
                window.api.setTemporaryData(key, value)
            } catch (exception) {
                throw new Error(
                    `Failed to update temporary data for the key "${key}": ${(exception as Error).message}`,
                    { cause: exception }
                )
            }
        },
        async updatePreferences(
            preferencesUpdate: Optional<DemanaPreferences, 'language'>
        ): Promise<DemanaPreferences> {
            try {
                window.api.setPreferences(preferencesUpdate)
                return await this.loadPreferences()
            } catch (exception) {
                throw new Error(`Failed to update preferences: ${(exception as Error).message}`, {
                    cause: exception
                })
            }
        },
        async loadAllTranslations(): Promise<Record<DemanaLocaleCode, DemanaLocaleTranslation>> {
            try {
                this.i18n.allTranslations = await window.api.getAllTranslations()
                return this.i18n.allTranslations
            } catch (exception) {
                throw new Error(`Failed to load all translations: ${(exception as Error).message}`, {
                    cause: exception
                })
            }
        },
        async loadAvailableLocaleCodes(): Promise<DemanaLocaleCode[]> {
            try {
                this.i18n.availableLocaleCodes = await window.api.getAvailableLocaleCodes()
                return this.i18n.availableLocaleCodes
            } catch (exception) {
                throw new Error(
                    `Failed to load all available locale codes: ${(exception as Error).message}`,
                    { cause: exception }
                )
            }
        },
        async openExternalLink(link: string): Promise<void> {
            try {
                await window.api.openExternalLink(link)
            } catch (exception) {
                throw new Error(`Failed to open an external link: ${(exception as Error).message}`, {
                    cause: exception
                })
            }
        },
        createBackofficeLink(link: string): string {
            try {
                const { RENDERER_VITE_BACK_OFFICE_URL } = import.meta.env

                if (!RENDERER_VITE_BACK_OFFICE_URL) {
                    throw new Error('the backoffice url is null.')
                }

                return [RENDERER_VITE_BACK_OFFICE_URL, link].join('/')
            } catch (exception) {
                throw new Error(`Failed to create a backoffice url: ${(exception as Error).message}`, {
                    cause: exception
                })
            }
        },
        logMessage(
            { service, level }: { service: string; level: DemanaLogLevel },
            message: string,
            ...meta: unknown[]
        ): void {
            try {
                window.api.log({ service, level }, message, ...meta)
            } catch (exception) {
                throw new Error(`Failed to log a message: ${(exception as Error).message}`, {
                    cause: exception
                })
            }
        }
    }
})
