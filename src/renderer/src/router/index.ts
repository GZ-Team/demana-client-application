import * as VueRouter from 'vue-router'

import DefaultLayout from '../layouts/default.vue'

import PrintersPage from '../pages/printers.vue'

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'printers',
        component: PrintersPage
      }
    ]
  }
]

export default VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes
})
