import BackofficeGraphQLClient from '../clients/backofficeClient'

import { useAuthStore } from '../stores/authStore'
import { useAppStore } from '../stores/appStore'

import useLogger from './useLogger'
import useLocalStorage from './useLocalStorage'

import { isDev } from '../utils/globals'
import { decodeJWT } from '../utils/tokenUtils'

import type { DemanaRequestHeaders, Optional } from '@root/types'
import type {
    DemanaApiRequestFeedback,
    DemanaGraphQLMutationOptions,
    DemanaGraphQLQueryOptions
} from '@ui/utils/graphQlUtils'

type useGraphQlValue = {
    query: <T>(
        options: Optional<DemanaGraphQLQueryOptions<T>, 'logger'>
    ) => Promise<DemanaApiRequestFeedback<T>>;
    mutate: <T>(
        options: Optional<DemanaGraphQLMutationOptions<T>, 'logger'>
    ) => Promise<DemanaApiRequestFeedback<T>>;
};

let client: BackofficeGraphQLClient | null = null

export default function useGraphQl(): useGraphQlValue {
    const {
        VITE_ACCESS_TOKEN_NAME: accessTokenName,
        VITE_REFRESH_TOKEN_NAME: refreshTokenName
    } = import.meta.env

    const logger = useLogger({ service: 'useGraphQl' })

    function getRequestHeaders(): DemanaRequestHeaders {
        const [accessToken, refreshToken] = useLocalStorage().getItems([accessTokenName, refreshTokenName])

        const headers =  Object.entries({
            authorization: accessToken,
            'refresh-token': refreshToken,
            'demana-client-id': useAppStore().appId
        } as DemanaRequestHeaders).filter(([, value]) => value).reduce((headers, [name, value]) => ({
            ...headers,
            [name]: value
        }), {} as DemanaRequestHeaders)

        useLogger({service: 'Request-headers'}).info(JSON.stringify(headers))

        return headers
    }

    function isExpiredJWT(token: string): boolean {
        try {
            const { exp } = decodeJWT(token)

            if (!exp) {
                return false
            }

            const now = new Date()
            const expirationDate = new Date(0)
            expirationDate.setUTCSeconds(exp)

            return expirationDate < now
        } catch (exception) {
            logger.error(`Failed to evaluate JWT expiration: ${(exception as Error).message}`)
            return true
        }
    }

    function createClient(): BackofficeGraphQLClient {
        const authStore = useAuthStore()

        return new BackofficeGraphQLClient({
            name: 'backoffice-client',
            baseUrl: import.meta.env.VITE_BACK_OFFICE_API_URL,
            connectToDevTools: isDev(),
            context: {
                headers: async () => ({ headers: getRequestHeaders() }),
                refreshWhen: async (request): Promise<boolean> => {
                    const isRefreshMutation = request.operationName === 'refresh'

                    if (isRefreshMutation) {
                        return false
                    }

                    const accessToken = useLocalStorage().getItem(accessTokenName)

                    if (!accessToken) {
                        return true
                    }



                    const hasAuthenticationExpired = isExpiredJWT(accessToken)

                    return !isRefreshMutation && hasAuthenticationExpired
                }
            },
            events: {
                onRefresh: async () => authStore.refresh(),
                onAccessDenied: async (): Promise<void> => {
                    await authStore.logout()
                },
                onNetworkError: async ({ statusCode }): Promise<void> => {
                    if (statusCode === 500) {
                        await authStore.logout()
                    }
                }
            }
        })
    }

    return {
        query: async <T>(
            options: Optional<DemanaGraphQLQueryOptions<T>, 'logger'>
        ): Promise<DemanaApiRequestFeedback<T>> => {
            if (!client) {
                client = createClient()
            }

            return await client.query({ ...options, logger })
        },
        mutate: async <T>(
            options: Optional<DemanaGraphQLMutationOptions<T>, 'logger'>
        ): Promise<DemanaApiRequestFeedback<T>> => {
            if (!client) {
                client = createClient()
            }

            return await client.mutate({ ...options, logger })
        }
    }
}
