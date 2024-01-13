import { createI18n } from 'vue-i18n';

import type { App } from 'vue';

export default {
  install: async (app: App) => {
    const [{ locale, translations }, availableLocales] = await Promise.all([
      window.api.getLocaleTranslations(),
      window.api.getAvailableLocaleCodes()
    ]);

    const i18n = createI18n({
      legacy: false,
      locale,
      messages: {
        [locale]: translations
      },
      availableLocales
    });

    app.use(i18n);
  }
};
