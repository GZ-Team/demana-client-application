import { defineStore } from 'pinia'
import { cloneDeep } from 'lodash'

import { useAppStore } from '@ui/stores/appStore'
import { useVenueStore } from '@ui/stores/venueStore'
import { usePrinterStore } from '@ui/stores/printerStore'

import useGraphQl from '@ui/composables/useGraphQl'
import useLocalStorage from '@ui/composables/useLocalStorage'
import useLogger from '@ui/composables/useLogger'

import { isNil } from '../../../../main/utils/sharedUtils'

import type { AuthenticationFeedback, LoginForm, UserDto } from '@generated/graphql'
import type { DemanaApiRequestFeedback } from '@ui/utils/graphQlUtils'


type StoreState = {
  user: UserDto | null;
};

const {
    VITE_ACCESS_TOKEN_NAME: accessTokenName,
    VITE_REFRESH_TOKEN_NAME: refreshTokenName
} = import.meta.env

export const useAuthStore = defineStore('authStore', {
    state: (): StoreState => ({
        user: null
    }),

    getters: {
        isLoggedIn: (): boolean => !!useLocalStorage().getItem(accessTokenName) && !!useAppStore().appId
    },

    actions: {
        async login(loginForm: LoginForm): Promise<DemanaApiRequestFeedback<AuthenticationFeedback>> {
            try {
                return await useGraphQl().mutate<AuthenticationFeedback>({
                    mutation: 'authentication.login',
                    variables: { loginForm },
                    key: 'login',
                    onSuccess: async (data) => {
                        if (!data) {
                            return
                        }

                        const logger = useLogger({service: 'login-request'})

                        const { token, refreshToken } = data

                        if (token?.value && refreshToken?.value) {
                            const localStorage = useLocalStorage()

                            localStorage.setItem(accessTokenName, token.value)
                            logger.info(`Setting the token '${accessTokenName}' with the value '${localStorage.getItem(accessTokenName)}'`)

                            localStorage.setItem(refreshTokenName, refreshToken.value)
                            logger.info(`Setting the token '${refreshTokenName}' with the value '${localStorage.getItem(refreshTokenName)}'`)
                        }
                    },
                    successMessage: 'success.authentication.login-success'
                })
            } catch (exception) {
                throw new Error(`Failed to login: ${(exception as Error).message}`, { cause: exception })
            }
        },
        async refresh(): Promise<void> {
            try {
                await window.api.refresh()
            } catch (exception) {
                throw new Error(`Failed to refresh authentication: ${(exception as Error).message}`, {
                    cause: exception
                })
            }
        },
        async registerDesktopApplication() {
            try {
                return await useGraphQl().mutate<string>({
                    mutation: 'desktop-application.registerDesktopApplication',
                    key: 'registerDesktopApplication',
                    successMessage: 'globals.notifications.authentication.register-desktop-application',
                    async onSuccess(data) {
                        if(!data) {
                            return
                        }

                        await useAppStore().setAppId(data)
                    },
                })
            } catch (exception) {
                throw new Error(`Failed to register this desktop application: ${(exception as Error).message}`, {
                    cause: exception
                })
            }
        },
        async logout(): Promise<void> {
            try {
                await window.api.logout()
            } catch (exception) {
                throw new Error(`Failed to logout: ${(exception as Error).message}`, { cause: exception })
            }
        },
        async getUser(): Promise<void> {
            try {
                const { data } = await useGraphQl().query<UserDto>({
                    query: 'authentication.getUser',
                    key: 'getUser'
                })

                if (data) {
                    const { venue, ...userProperties } = cloneDeep(data)

                    this.user = userProperties

                    if (venue) {
                        useVenueStore().venue = venue

                        window.api.setVenueId(venue.id)

                        if (!useAppStore().appId && venue.configuration && venue.configuration.venuePrinterConfiguration) {
                            const { automatic, paperMargin, paperWidth } = venue.configuration.venuePrinterConfiguration
                            const printerStore = usePrinterStore()

                            const existingPrintingConfiguration = await printerStore.loadPrintingConfiguration()

                            Object.entries({ automatic, paperMargin, paperWidth })
                                .filter(([, value]) => !isNil(value))
                                .forEach(([key, value]) => existingPrintingConfiguration[key] = value)

                            await printerStore.updatePrintingConfiguration(existingPrintingConfiguration)
                        }
                    }
                }
            } catch (exception) {
                throw new Error(`Failed to get user: ${(exception as Error).message}`, {
                    cause: exception
                })
            }
        }
    }
})
