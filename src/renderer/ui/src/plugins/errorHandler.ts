import useLogger from '@ui/composables/useLogger'

import type { App, Plugin } from 'vue'

export default {
    install: (app: App) => {
        app.config.errorHandler = (error, _instance, _info): void => {
            useLogger({ service: 'Error handler' }).error(JSON.stringify({
                error, _instance, _info
            }))
        }
    }
} as Plugin
