import { ApolloClient, createHttpLink, from, InMemoryCache } from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { removeTypenameFromVariables } from '@apollo/client/link/remove-typename'

import useLogger from '../composables/useLogger'

import {
    DemanaApiRequestFeedback,
    DemanaGraphQLMutationOptions,
    DemanaGraphQLQueryOptions,
    handleGraphQlMutation,
    handleGraphQlQuery
} from '../utils/graphQlUtils'

import type { NormalizedCacheObject, GraphQLRequest } from '@apollo/client'
import type { NetworkError } from '@apollo/client/errors'
import type { DemanaRequestHeaders } from '@root/types'
import type { DemanaLogger } from '@root/types.ts'

type DemanaNetworkError = NetworkError & {
  statusCode?: number;
};

type DemanaClientOptions = {
  name: string;
  baseUrl: string;
  connectToDevTools: boolean;
  context: {
    headers: (
      request: GraphQLRequest
    ) => { headers: DemanaRequestHeaders } | Promise<{ headers: DemanaRequestHeaders }>;
    refreshWhen: (request: GraphQLRequest) => boolean | Promise<boolean>;
  };
  events: {
    onRefresh: (request: GraphQLRequest) => void | Promise<void>;
    onAccessDenied: () => void;
    onNetworkError: (error: DemanaNetworkError) => void;
  };
};

export default class BackofficeGraphQLClient {
    private logger: DemanaLogger
    private apolloClient: ApolloClient<NormalizedCacheObject>

    constructor(options: DemanaClientOptions) {
        this.apolloClient = this.createApolloClient(options)
        this.logger = useLogger({ service: options.name })
    }

    private createApolloClient(options: DemanaClientOptions): ApolloClient<NormalizedCacheObject> {
        const context = setContext(async (request) => {
            try {
                if (await options.context.refreshWhen(request)) {
                    await options.events.onRefresh(request)
                }

                return await options.context.headers(request)
            } catch (exception) {
                this.logger.error(`Failed to set context: ${(exception as Error).message}`)
                return { headers: await options.context.headers(request) }
            }
        })

        const onErrorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
            if (graphQLErrors) {
                this.logger.error('GRAPHQL ERROR', graphQLErrors)

                const hasAccessDenied = !!graphQLErrors.find(({ extensions: { status } }) =>
                    [401].includes(status as number)
                )

                if (hasAccessDenied) {
                    options.events.onAccessDenied()
                }
            } else if (networkError) {
                options.events.onNetworkError(networkError)
            } else {
                forward(operation)
            }
        })

        const removeTypenameLink = removeTypenameFromVariables()

        const httpLink = createHttpLink({ uri: options.baseUrl })

        return new ApolloClient({
            name: options.name,
            link: from([context, onErrorLink, removeTypenameLink, httpLink]),
            cache: new InMemoryCache({
                resultCaching: false
            }),
            connectToDevTools: options.connectToDevTools,
            defaultOptions: {
                watchQuery: {
                    fetchPolicy: 'no-cache',
                    errorPolicy: 'ignore'
                },
                query: {
                    fetchPolicy: 'no-cache',
                    errorPolicy: 'all'
                },
                mutate: {
                    fetchPolicy: 'no-cache',
                    errorPolicy: 'all'
                }
            }
        })
    }

    async mutate<T>(options: DemanaGraphQLMutationOptions<T>): Promise<DemanaApiRequestFeedback<T>> {
        return handleGraphQlMutation(this.apolloClient, options)
    }

    async query<T>(options: DemanaGraphQLQueryOptions<T>): Promise<DemanaApiRequestFeedback<T>> {
        return handleGraphQlQuery(this.apolloClient, options)
    }
}
