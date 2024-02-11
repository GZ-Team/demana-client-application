import { defineStore } from 'pinia'
import { useCookies } from '@vueuse/integrations/useCookies'

import { useAppStore } from '@ui/stores/appStore'
import { useVenueStore } from '@ui/stores/venueStore'
import { usePrinterStore } from '@ui/stores/printerStore'

import useGraphQl from '@ui/composables/useGraphQl'

import type { UserDto, LoginForm, AuthenticationFeedback } from '@generated/graphql'
import { isNil } from '@root/main/utils/sharedUtils'

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
        isLoggedIn: (): boolean => !!useCookies([accessTokenName]).get(accessTokenName)
    },

    actions: {
        async login(loginForm: LoginForm): Promise<AuthenticationFeedback> {
            try {
                return await useGraphQl().mutate<AuthenticationFeedback>({
                    mutation: 'authentication.login',
                    variables: { loginForm },
                    key: 'login',
                    onSuccess: async (data) => {
                        if (!data) {
                            return
                        }

                        const { token, refreshToken } = data

                        if (token?.value && refreshToken?.value) {
                            const cookies = useCookies([accessTokenName, refreshTokenName])

                            cookies.set(accessTokenName, token.value, {
                                expires: new Date(token.expirationDate!)
                            })
                            cookies.set(refreshTokenName, refreshToken.value, {
                                expires: new Date(refreshToken.expirationDate!)
                            })
                        }
                    },
                    successMessage: 'success.authentication.login-success'
                })
            } catch (exception) {
                throw new Error(`Failed to logout: ${(exception as Error).message}`, { cause: exception })
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
                    const { venue, ...userProperties } = data

                    this.user = userProperties

                    if (venue) {
                        useVenueStore().venue = venue

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
