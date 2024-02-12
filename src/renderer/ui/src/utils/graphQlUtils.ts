import { GraphQLErrors } from '@apollo/client/errors'

import graphQlOperations from '../graphql'

import type {
    ApolloClient,
    DocumentNode,
    NormalizedCacheObject,
    TypedDocumentNode
} from '@apollo/client'
import type { GraphQLQueryOperationPath, GraphQLMutationOperationPath } from '../graphql'
import type { DemanaLogger } from '@root/types'

export type DemanaGraphQLOperationOptions<T> = {
  variables?: Record<string, unknown>;
  key: string;
  successMessage?: string;
  errorMessage?: string;
  args?: Record<string, unknown>;
  logger: DemanaLogger;
  onSuccess?: (
    data: DemanaApiRequestFeedback<T>['data'],
    feedback: DemanaApiRequestFeedback<T>
  ) => void | DemanaApiRequestFeedback<T> | Promise<void | DemanaApiRequestFeedback<T>>;
  onError?: (
    errors: GraphQLErrors,
    feedback: DemanaApiRequestFeedback<T>
  ) => void | DemanaApiRequestFeedback<T> | Promise<void | DemanaApiRequestFeedback<T>>;
};

export type DemanaGraphQLMutationOptions<T> = DemanaGraphQLOperationOptions<T> & {
  mutation: GraphQLMutationOperationPath;
};

export type DemanaGraphQLQueryOptions<T> = DemanaGraphQLOperationOptions<T> & {
  query: GraphQLQueryOperationPath;
};

export type DemanaApiRequestFeedback<T> = {
  data?: T;
  success?: boolean;
  message?: string;
  args?: Record<string, unknown>;
};

export type DemanaApiGraphQLError = Error & { graphQLErrors: GraphQLErrors };

const defaultMessages = {
    success: 'globals.notifications.success.default',
    error: 'globals.notifications.error.default'
}

function getGraphQlOperationDocumentByPath(
    path: GraphQLQueryOperationPath | GraphQLMutationOperationPath
): DocumentNode | TypedDocumentNode<unknown, Record<string, unknown>> {
    try {
        const graphQlOperationDocument = path
            .split('.')
            .reduce((operation: object, step: string) => operation[step], graphQlOperations)

        if (!graphQlOperationDocument) {
            throw new Error('no operation document was found.')
        }

        return graphQlOperationDocument as
      | DocumentNode
      | TypedDocumentNode<unknown, Record<string, unknown>>
    } catch (exception) {
        throw new Error(
            `Failed to find a GraphQL operation document with a path '${path}': ${
                (exception as Error).message
            }`,
            { cause: exception }
        )
    }
}

export async function handleGraphQlMutation<T>(
    client: ApolloClient<NormalizedCacheObject>,
    options: DemanaGraphQLMutationOptions<T>
): Promise<DemanaApiRequestFeedback<T>> {
    const {
        mutation,
        variables,
        key,
        onSuccess,
        successMessage,
        errorMessage,
        onError,
        args,
        logger
    } = options

    let feedback: DemanaApiRequestFeedback<T> = { args: { ...args, ...variables } }

    try {
        const response = await client.mutate<T>({
            variables,
            mutation: getGraphQlOperationDocumentByPath(`mutations.${mutation}`)
        })

        const { data, errors } = response

        if (!errors) {
            const keyData = data![key] || {}
            const { message, success } = keyData

            feedback.data = keyData as T
            feedback.success = success ?? true
            feedback.message = message ?? successMessage ?? defaultMessages.success

            if (feedback.success && !!onSuccess) {
                const updatedFeedback = await onSuccess(keyData, feedback)

                if (updatedFeedback) {
                    const { success, message } = updatedFeedback
                    feedback = {
                        ...feedback,
                        message,
                        success
                    }
                }
            }
        } else {
            if (onError) {
                const updatedFeedback = await onError(errors, feedback)

                if (updatedFeedback) {
                    const { success, message } = updatedFeedback
                    feedback = {
                        ...feedback,
                        message,
                        success
                    }
                }
            }

            feedback.message = errors ? errors[0].message : defaultMessages.error
            feedback.success = false
        }
    } catch (exception) {
        const { graphQLErrors = [] } = exception as DemanaApiGraphQLError

        logger.error(`Failed to execute mutation '${key}': ${(exception as Error).message}`)

        if (!onError) {
            feedback.message = graphQLErrors[0]
                ? graphQLErrors[0].message
                : errorMessage ?? defaultMessages.error
            feedback.success = false
        } else {
            const updatedFeedback = await onError(graphQLErrors, feedback)

            if (updatedFeedback) {
                const { success, message } = updatedFeedback
                feedback = {
                    ...feedback,
                    message,
                    success
                }
            }
        }
    }

    return feedback
}

export async function handleGraphQlQuery<T>(
    client: ApolloClient<NormalizedCacheObject>,
    options: DemanaGraphQLQueryOptions<T>
): Promise<DemanaApiRequestFeedback<T>> {
    const { query, variables, key, onSuccess, successMessage, onError, errorMessage, args, logger } =
    options

    let feedback: DemanaApiRequestFeedback<T> = { args: { ...args, ...variables } }

    try {
        const response = await client.query<T>({
            variables,
            query: getGraphQlOperationDocumentByPath(`queries.${query}`)
        })

        const { data, errors } = response

        if (!errors) {
            const keyData = data[key] || {}
            const { message, success } = keyData

            feedback.data = keyData as T
            feedback.success = success ?? true
            feedback.message = message ?? successMessage ?? defaultMessages.success

            if (feedback.success && onSuccess) {
                const updatedFeedback = await onSuccess(keyData, feedback)

                if (updatedFeedback) {
                    const { success, message } = updatedFeedback
                    feedback = {
                        ...feedback,
                        message,
                        success
                    }
                }
            }
        } else {
            if (onError) {
                const updatedFeedback = await onError(errors, feedback)

                if (updatedFeedback) {
                    const { success, message } = updatedFeedback
                    feedback = {
                        ...feedback,
                        message,
                        success
                    }
                }
            }

            feedback.message = errors ? errors[0].message : defaultMessages.error
            feedback.success = false
        }
    } catch (exception) {
        const { graphQLErrors = [] } = exception as DemanaApiGraphQLError

        logger.error(`Failed to execute query '${key}': ${(exception as Error).message}`)

        if (!onError) {
            feedback.message = graphQLErrors[0]
                ? graphQLErrors[0].message
                : errorMessage ?? defaultMessages.error
            feedback.success = false
        } else {
            const updatedFeedback = await onError(graphQLErrors, feedback)

            if (updatedFeedback) {
                const { success, message } = updatedFeedback
                feedback = {
                    ...feedback,
                    message,
                    success
                }
            }
        }
    }

    return feedback
}
