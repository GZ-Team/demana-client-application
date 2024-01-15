import { createApp } from 'vue';
import { createPinia } from 'pinia';

import errorHandler from './plugins/errorHandler';
import deviceEventListeners from './plugins/deviceEventListeners';
import globalComponents from './plugins/globalComponents';
import vuetify from './plugins/vuetify'

import router from './router';
import { setupI18n } from './utils/i18n';

import './assets/styling/_main.scss';

import App from './App.vue';

const pinia = createPinia();
const i18n = await setupI18n()

createApp(App)
  .use(pinia)
  .use(vuetify)
  .use(i18n)
  .use(router)
  .use(errorHandler)
  .use(deviceEventListeners)
  .use(globalComponents)
  .mount('#demana-client-application');
