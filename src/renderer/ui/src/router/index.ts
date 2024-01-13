import * as VueRouter from 'vue-router';

import DefaultLayout from '../layouts/default.vue';

import PrintersPage from '../pages/printers.vue';

const routes = [
  {
    path: '',
    component: DefaultLayout,
    alias: ['/ui/index.html'],
    children: [
      {
        path: '',
        name: 'Printers',
        component: PrintersPage
      }
    ]
  }
] as VueRouter.RouterOptions['routes'];

export default VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes
});
