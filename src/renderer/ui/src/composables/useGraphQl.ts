import { useCookies } from '@vueuse/integrations/useCookies';

import BackofficeGraphQLClient from '../clients/backofficeClient';

import { useAuthStore } from '../stores/authStore';

import useLogger from './useLogger';

import { isDev } from '../utils/globals';
import { decodeJWT } from '../utils/tokenUtils';

import type { DemanaRequestHeaders, Optional } from '@root/types.ts';
import {
  DemanaApiRequestFeedback,
  DemanaGraphQLMutationOptions,
  DemanaGraphQLQueryOptions
} from '@ui/utils/graphQlUtils.ts';

type useGraphQlValue = {
  query: <T>(
    options: Optional<DemanaGraphQLQueryOptions<T>, 'logger'>
  ) => Promise<DemanaApiRequestFeedback<T>>;
  mutate: <T>(
    options: Optional<DemanaGraphQLMutationOptions<T>, 'logger'>
  ) => Promise<DemanaApiRequestFeedback<T>>;
};

let client: BackofficeGraphQLClient | null = null;

export default function useGraphQl(): useGraphQlValue {
  const {
    VITE_ACCESS_TOKEN_NAME: accessTokenName,
    VITE_DEMANA_REFRESH_TOKEN_NAME: refreshTokenName
  } = import.meta.env;

  const logger = useLogger({ service: 'useGraphQl' });

  function getCookie(key: string): string {
    const cookies = useCookies([key]);

    console.log({cookie: cookies.get(key), key})

    return cookies.get(key);
  }

  function getRequestHeaders(): DemanaRequestHeaders {
    return {
      authorization: getCookie(accessTokenName),
      'refresh-token': getCookie(refreshTokenName)
    };
  }

  function isExpiredJWT(token: string): boolean {
    try {
      const { exp } = decodeJWT(token);

      if (!exp) {
        return false;
      }

      const now = new Date();
      const expirationDate = new Date(0);
      expirationDate.setUTCSeconds(exp);

      return expirationDate < now;
    } catch (exception) {
      logger.error(`Failed to evaluate JWT expiration: ${(exception as Error).message}`);
      return true;
    }
  }

  function createClient(): BackofficeGraphQLClient {
    const authStore = useAuthStore();

    return new BackofficeGraphQLClient({
      name: 'backoffice-client',
      baseUrl: import.meta.env.VITE_BACK_OFFICE_API_URL,
      connectToDevTools: isDev(),
      context: {
        headers: async () => ({ headers: getRequestHeaders() }),
        refreshWhen: async (request): Promise<boolean> => {
          const isRefreshMutation = request.operationName === 'refresh';

          if (!isRefreshMutation) {
            return false;
          }

          const hasAuthenticationExpired = isExpiredJWT(getCookie(accessTokenName));

          return !isRefreshMutation && hasAuthenticationExpired;
        }
      },
      events: {
        onRefresh: async () => authStore.refresh(),
        onAccessDenied: async (): Promise<void> => {
          await authStore.logout();
        },
        onNetworkError: async ({ statusCode }): Promise<void> => {
          if (statusCode === 500) {
            await authStore.logout();
          }
        }
      }
    });
  }

  return {
    query: async <T>(
      options: Optional<DemanaGraphQLQueryOptions<T>, 'logger'>
    ): Promise<DemanaApiRequestFeedback<T>> => {
      if (!client) {
        client = createClient();
      }

      return await client.query({ ...options, logger });
    },
    mutate: async <T>(
      options: Optional<DemanaGraphQLMutationOptions<T>, 'logger'>
    ): Promise<DemanaApiRequestFeedback<T>> => {
      if (!client) {
        client = createClient();
      }

      return await client.mutate({ ...options, logger });
    }
  };
}
