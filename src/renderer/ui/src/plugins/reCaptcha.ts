import { VueReCaptcha } from 'vue-recaptcha-v3';

import type { App, Plugin } from 'vue';
import type { IReCaptchaOptions } from 'vue-recaptcha-v3/dist/IReCaptchaOptions';

export default {
  install: (app: App): void => {
    app.use(VueReCaptcha, {
      siteKey: import.meta.env.RENDERER_VITE_RECAPTCHA_SITE_KEY
    } as IReCaptchaOptions);
  }
} as Plugin;
