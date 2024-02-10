import DIcon from '@ui/components/global/DIcon.vue';
import DVerticalSpacer from '@ui/components/global/DVerticalSpacer.vue';
import DLink from '@ui/components/global/DLink.vue';
import DPageHeader from '@ui/components/global/DPageHeader.vue';

import type { App, Plugin } from 'vue';

export default {
  install: (app: App) => {
    // GLOBAL COMPONENTS
    app.component('DIcon', DIcon);
    app.component('DVerticalSpacer', DVerticalSpacer);
    app.component('DLink', DLink);
    app.component('DPageHeader', DPageHeader)
  }
} as Plugin;
