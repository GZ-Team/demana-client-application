import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'

const pinia = createPinia()
import router from './router'

import './assets/styling/_main.scss'

import errorHandler from './plugins/errorHandler'
import deviceEventListeners from './plugins/deviceEventListeners'
import globalComponents from './plugins/globalComponents'

createApp(App).use(pinia).use(router).use(errorHandler).use(deviceEventListeners).use(globalComponents).mount('#demana-client-application')
