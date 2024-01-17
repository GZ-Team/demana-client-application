import * as VueRouter from 'vue-router';

import DefaultLayout from '../layouts/default.vue';

import PrinterConfigurationPage from '../pages/printerConfiguration.vue';

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
      }
    ]
  }
] as VueRouter.RouterOptions['routes'];

export default VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes
});
