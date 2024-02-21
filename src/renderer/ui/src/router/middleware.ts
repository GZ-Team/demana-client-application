import { storeToRefs } from 'pinia'

import { useAppStore } from '@ui/stores/appStore'
import { useAuthStore } from '@ui/stores/authStore'

import useLocalStorage from '@ui/composables/useLocalStorage'

import { DEFAULT_ROUTE, loginPageRoute } from './routes'

import type { RouteLocationRaw, Router } from 'vue-router'

type NavigationGuardReturn = void | Error | RouteLocationRaw | boolean;

const {
    VITE_ACCESS_TOKEN_NAME: accessTokenName,
} = import.meta.env

let redirectionRouteName: string | undefined | null = null
let isRedirecting = false

function beforeEach(router: Router) {
    router.beforeEach(async (to, _from): Promise<NavigationGuardReturn> => {
        const authStore = useAuthStore()
        const appStore = useAppStore()

        const {user} = storeToRefs(authStore)
        const { logout, getUser } = authStore

        const {appId} = storeToRefs(appStore)
        const {getAppId} = appStore

        const isLoggedIn = appId.value && useLocalStorage().getItem(accessTokenName)

        if (!to.meta.$public && !isLoggedIn) {
            await logout()
            return { name: loginPageRoute.name, replace: true } as RouteLocationRaw
        }

        if (isLoggedIn && !user.value) {
            await getUser()
        }

        if (isLoggedIn && !appId.value) {
            await getAppId()
        }

        const { loadTemporaryData } = useAppStore()

        const { redirectionRoute: temporaryRedirectionRouteName } = await loadTemporaryData()
        redirectionRouteName = temporaryRedirectionRouteName

        if (redirectionRouteName && router.hasRoute(redirectionRouteName) && !isRedirecting) {
            isRedirecting = true
            return { name: redirectionRouteName, replace: true } as RouteLocationRaw
        } else if (to.name === loginPageRoute.name && isLoggedIn) {
            return { name: DEFAULT_ROUTE.name, replace: true } as RouteLocationRaw
        }

        if (!to.name) {
            return { name: DEFAULT_ROUTE.name, replace: true } as RouteLocationRaw
        }
    })
}

function afterEach(router: Router) {
    router.afterEach((_to, _from): NavigationGuardReturn => {
        const { updateTemporaryData } = useAppStore()

        const hasBeenRedirectedToRedirectionRoute =
      isRedirecting && router.currentRoute.value.name === redirectionRouteName

        if (hasBeenRedirectedToRedirectionRoute) {
            updateTemporaryData('redirectionRoute', null)
            isRedirecting = false
        }
    })
}

export function installMiddleware(router: Router): void {
    if (!router) {
        return
    }

    beforeEach(router)
    afterEach(router)
}
