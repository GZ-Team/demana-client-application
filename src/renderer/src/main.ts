import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from '@renderer/App.vue'

const pinia = createPinia()
import router from '@renderer/router'

import '@renderer/assets/styling/_main.scss'

import globalComponents from '@renderer/plugins/globalComponents'

createApp(App).use(pinia).use(router).use(globalComponents).mount('#demana-client-application')
