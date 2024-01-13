import allLocaleTranslations from '../locales';

import type { DemanaLocaleTranslation, DemanaLocaleTranslationDto } from '../../types';

type TranslationServiceOptions = {
  defaultLocale: string;
};

export default class {
  private locale: string;
  private defaultLocale: string;

  constructor(locale: string, options: TranslationServiceOptions = { defaultLocale: 'en' }) {
    this.locale = this.parseLocaleCode(locale) || options.defaultLocale;
    this.defaultLocale = options.defaultLocale;
  }

  get translations(): DemanaLocaleTranslationDto {
    try {
      let localeTranslations = {
        locale: this.locale,
        translations: allLocaleTranslations[this.locale] as DemanaLocaleTranslation
      };

      if (!localeTranslations.translations) {
        localeTranslations = {
          locale: this.defaultLocale,
          translations: allLocaleTranslations[this.defaultLocale] as DemanaLocaleTranslation
        };
      }

      if (!localeTranslations.translations) {
        throw new Error(`no translations for locale codes`);
      }

      return localeTranslations;
    } catch (exception) {
      throw new Error(
        `Failed to get translations for locale codes: ${(exception as Error).message} [current: ${
          this.locale
        }, default: ${this.defaultLocale}]`
      );
    }
  }

  get availableLocaleCodes(): string[] {
    return Object.keys(allLocaleTranslations);
  }

  private parseLocaleCode(value: string): string | null {
    return (
      this.availableLocaleCodes.find((localeCode) =>
        value.toLowerCase().includes(localeCode.toLowerCase())
      ) || null
    );
  }

  translate = (key: string, context: Record<string, string> = {}): string => {
    try {
      const rawTranslation = key
        .split('.')
        .reduce(
          (translation: undefined | DemanaLocaleTranslation | string, keyPart) =>
            translation ? translation[keyPart] : translation,
          this.translations.translations
        ) as string | undefined;

      if (!rawTranslation) {
        console.warn(`Unknown key: '${key}'`);
        return key;
      }

      return Object.entries(context).reduce(
        (translation, [key, value]) => translation.replaceAll(`{${key}}`, value),
        rawTranslation
      );
    } catch (exception) {
      throw new Error(`Failed to translate key '${key}': ${(exception as Error).message}'`, {
        cause: exception
      });
    }
  };
}
