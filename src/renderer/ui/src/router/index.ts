import * as VueRouter from 'vue-router';

import DefaultLayout from '../layouts/default.vue';

import PrinterConfigurationPage from '../pages/printerConfiguration.vue';
import PreferencesPage from '../pages/preferences.vue';

const routes = [
  {
    path: '',
    component: DefaultLayout,
    alias: ['/ui/index.html'],
    children: [
      {
        path: '',
        name: 'PrinterConfiguration',
        component: PrinterConfigurationPage
      },
      {
        path: 'preferences',
        name: 'Preferences',
        component: PreferencesPage
      }
    ]
  }
] as VueRouter.RouterOptions['routes'];

export default VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes
});
