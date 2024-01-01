import type { App } from "vue";

export default {
    install: (app: App) => {
        app.config.errorHandler = (_error, _instance, _info) => {
        }
    }
}