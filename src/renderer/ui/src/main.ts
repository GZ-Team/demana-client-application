import { createApp } from 'vue';
import { createPinia } from 'pinia';

import errorHandler from './plugins/errorHandler';
import deviceEventListeners from './plugins/deviceEventListeners';
import globalComponents from './plugins/globalComponents';
import i18n from './plugins/vue-i18n';

import router from './router';

import './assets/styling/_main.scss';

import App from './App.vue';

const pinia = createPinia();

createApp(App)
  .use(pinia)
  .use(i18n)
  .use(router)
  .use(errorHandler)
  .use(deviceEventListeners)
  .use(globalComponents)
  .mount('#demana-client-application');
