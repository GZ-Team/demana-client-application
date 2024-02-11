import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import { createPinia } from 'pinia'

import errorHandler from '@ui/plugins/errorHandler'
import deviceEventListeners from '@ui/plugins/deviceEventListeners'
import globalComponents from '@ui/plugins/globalComponents'
import vuetify from '@ui/plugins/vuetify'
import reCaptcha from '@ui/plugins/reCaptcha'

import { createDemanaRouter } from '@ui/router'

import '@ui/assets/styling/_main.scss'

import App from '@ui/App.vue'

const pinia = createPinia()
const i18n = createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en'
})
const demanaRouter = createDemanaRouter()

createApp(App)
    .use(pinia)
    .use(vuetify)
    .use(i18n)
    .use(demanaRouter)
    .use(errorHandler)
    .use(deviceEventListeners)
    .use(globalComponents)
    .use(reCaptcha)
    .mount('#demana-client-application')
