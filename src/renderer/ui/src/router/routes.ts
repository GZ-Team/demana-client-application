import type { RouteRecordRaw } from 'vue-router';

import DefaultLayout from '../layouts/default.vue';

import PrinterConfigurationPage from '../pages/printerConfiguration.vue';
import PreferencesPage from '../pages/preferences.vue';

// PAGES
const printerConfigurationPageRoute: RouteRecordRaw = {
  path: '',
  name: 'PrinterConfiguration',
  component: PrinterConfigurationPage
};

const preferencesPageRoute: RouteRecordRaw = {
  path: 'preferences',
  name: 'Preferences',
  component: PreferencesPage
};

// LAYOUTS
const defaultLayoutRoute: RouteRecordRaw = {
  path: '',
  component: DefaultLayout,
  alias: ['/ui/index.html'],
  children: [printerConfigurationPageRoute, preferencesPageRoute]
};

export default [defaultLayoutRoute] as RouteRecordRaw[];

export const DEFAULT_ROUTE: RouteRecordRaw = printerConfigurationPageRoute;
