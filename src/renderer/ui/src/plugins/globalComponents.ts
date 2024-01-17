import type { App } from 'vue';

import DIconVue from '../components/global/DIcon.vue';
import DVerticalSpacer from '../components/global/DVerticalSpacer.vue';

export default {
  install: (app: App) => {
    // GLOBAL COMPONENTS
    app.component('DIcon', DIconVue);
    app.component('DVerticalSpacer', DVerticalSpacer);
  }
};
