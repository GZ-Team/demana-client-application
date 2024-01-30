import DIconVue from '../components/global/DIcon.vue';
import DVerticalSpacer from '../components/global/DVerticalSpacer.vue';

import type { App, Plugin } from 'vue';

export default {
  install: (app: App) => {
    // GLOBAL COMPONENTS
    app.component('DIcon', DIconVue);
    app.component('DVerticalSpacer', DVerticalSpacer);
  }
} as Plugin;
