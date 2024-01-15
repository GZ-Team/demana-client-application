import type { App } from 'vue';

import DError from '../components/global/DError.vue';

export default {
  install: (app: App) => {
    // GLOBAL COMPONENTS
    app.component('DError', DError);
  }
};
