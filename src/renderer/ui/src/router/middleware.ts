import { DEFAULT_ROUTE } from '../router/routes';

import { useAppStore } from '../stores/appStore';

import type { RouteLocationRaw, Router } from 'vue-router';

type NavigationGuardReturn = void | Error | RouteLocationRaw | boolean;

let redirectionRouteName: string | undefined | null = null;
let isRedirecting = false;

function beforeEach(router: Router) {
  router.beforeEach(async (to, _from): Promise<NavigationGuardReturn> => {
    const { loadTemporaryData } = useAppStore();

    const { redirectionRoute: temporaryRedirectionRouteName } = await loadTemporaryData();
    redirectionRouteName = temporaryRedirectionRouteName;

    if (redirectionRouteName && router.hasRoute(redirectionRouteName) && !isRedirecting) {
      isRedirecting = true;
      return { name: redirectionRouteName, replace: true } as RouteLocationRaw;
    }

    if (!to.name) {
      return { ...DEFAULT_ROUTE, replace: true } as RouteLocationRaw;
    }
  });
}

function afterEach(router: Router) {
  router.afterEach((_to, _from): NavigationGuardReturn => {
    const { updateTemporaryData } = useAppStore();

    const hasBeenRedirectedToRedirectionRoute =
      isRedirecting && router.currentRoute.value.name === redirectionRouteName;

    if (hasBeenRedirectedToRedirectionRoute) {
      updateTemporaryData('redirectionRoute', null);
      isRedirecting = false;
    }
  });
}

export function installMiddleware(router: Router): void {
  if (!router) {
    return;
  }

  beforeEach(router);
  afterEach(router);
}
