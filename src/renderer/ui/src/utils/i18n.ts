import { createI18n } from 'vue-i18n';

import type { I18n } from 'vue-i18n'
import type { DemanaLocaleTranslation } from 'types';
import { App } from 'vue';

type DemanaLocaleInformation = {
    locale: string
    translations: DemanaLocaleTranslation
    availableLocales: string[]
}

export async function loadLocaleInformation(): Promise<DemanaLocaleInformation> {
    const [{ locale, translations }, availableLocales] = await Promise.all([
        window.api.getLocaleTranslations(),
        window.api.getAvailableLocaleCodes()
    ]);

    return {
        locale,
        translations,
        availableLocales
    }
}

export async function setupI18n(): Promise<I18n> {
    const { locale, translations, availableLocales } = await loadLocaleInformation()

    return createI18n({
        legacy: false,
        locale,
        messages: {
            [locale]: translations
        },
        availableLocales
    });
}