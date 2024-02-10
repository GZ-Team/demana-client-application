import type { RouteRecordRaw } from 'vue-router';

import DefaultLayout from '@ui/layouts/default.vue';
import UnauthenticatedLayout from '@ui/layouts/unauthenticated.vue';

import PrinterConfigurationPage from '@ui/pages/configuration/printer.vue';
import PreferencesPage from '@ui/pages/preferences.vue';

import LoginPage from '@ui/pages/login.vue';

type DemanaRouteMetaOptions = {
  $public?: boolean;
};

function createPageRoute(options: RouteRecordRaw, meta?: DemanaRouteMetaOptions): RouteRecordRaw {
  return { ...options, meta };
}

function createPublicPageRoute(options: RouteRecordRaw): RouteRecordRaw {
  return createPageRoute(options, { $public: true });
}

// PUBLIC PAGES
export const loginPageRoute: RouteRecordRaw = createPublicPageRoute({
  path: 'login',
  name: 'Login',
  component: LoginPage
});

const preferencesPageRoute: RouteRecordRaw = createPublicPageRoute({
  path: 'preferences',
  name: 'Preferences',
  component: PreferencesPage
});

// AUTHENTICATED PAGES: CONFIGURATION
const printerConfigurationPageRoute: RouteRecordRaw = createPageRoute({
  path: 'printer',
  name: 'PrinterConfiguration',
  component: PrinterConfigurationPage
});

export const configurationPageRoute: RouteRecordRaw = createPageRoute({
  path: '',
  name: 'Configuration',
  redirect: {name: 'PrinterConfiguration'},
  children: [printerConfigurationPageRoute]
});

// LAYOUTS
const unauthenticatedLayoutRoute: RouteRecordRaw = createPublicPageRoute({
  path: '/',
  component: UnauthenticatedLayout,
  alias: ['/ui/index.html'],
  children: [loginPageRoute, preferencesPageRoute]
});

const defaultLayoutRoute: RouteRecordRaw = createPageRoute({
  path: '/configuration',
  component: DefaultLayout,
  children: [configurationPageRoute]
});

export const DEFAULT_ROUTE: RouteRecordRaw = configurationPageRoute;

export default [unauthenticatedLayoutRoute, defaultLayoutRoute] as RouteRecordRaw[];
