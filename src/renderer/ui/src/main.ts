import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createI18n } from 'vue-i18n';

import errorHandler from './plugins/errorHandler';
import deviceEventListeners from './plugins/deviceEventListeners';
import globalComponents from './plugins/globalComponents';
import vuetify from './plugins/vuetify'
import apiEventListeners from './plugins/apiEventListeners';

import router from './router';

import './assets/styling/_main.scss';

import App from './App.vue';

const pinia = createPinia();
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en'
});

createApp(App)
  .use(pinia)
  .use(vuetify)
  .use(i18n)
  .use(router)
  .use(errorHandler)
  .use(deviceEventListeners)
  .use(globalComponents)
  .use(apiEventListeners)
  .mount('#demana-client-application');
