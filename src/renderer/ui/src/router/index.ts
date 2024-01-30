import { createRouter, createWebHistory } from 'vue-router';

import { installMiddleware } from './middleware';

import routes from './routes';

export function createDemanaRouter() {
  const router = createRouter({
    history: createWebHistory(),
    routes
  });

  installMiddleware(router);

  return router;
}
