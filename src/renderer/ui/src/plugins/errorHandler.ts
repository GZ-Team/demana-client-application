import type { App, Plugin } from 'vue';

export default {
  install: (app: App) => {
    app.config.errorHandler = (_error, _instance, _info) => {};
  }
} as Plugin;
