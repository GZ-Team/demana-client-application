import allLocaleTranslations from '../locales';

import PreferencesService from './preferencesService';

import type {
  DemanaLocaleCode,
  DemanaLocaleTranslation,
  DemanaLocaleTranslationDto
} from '../../types';

export default class TranslationService extends PreferencesService {
  private get locale(): DemanaLocaleCode {
    return super.preferences.language as DemanaLocaleCode;
  }

  get translations(): DemanaLocaleTranslationDto {
    try {
      const localeTranslations = {
        locale: this.locale,
        translations: this.allTranslations[this.locale]
      } as DemanaLocaleTranslationDto;

      if (!localeTranslations.translations) {
        throw new Error(`no translations for locale codes`);
      }

      return localeTranslations;
    } catch (exception) {
      throw new Error(
        `Failed to get translations for locale codes: ${(exception as Error).message} [current: ${
          this.locale
        }]`
      );
    }
  }

  get allTranslations(): Record<DemanaLocaleCode, DemanaLocaleTranslation> {
    return allLocaleTranslations;
  }

  get availableLocaleCodes(): DemanaLocaleCode[] {
    return Object.keys(this.allTranslations) as DemanaLocaleCode[];
  }

  translate(key: string, context: Record<string, string> = {}): string {
    try {
      const rawTranslation = key
        .split('.')
        .reduce(
          (translation: undefined | unknown | string, keyPart) =>
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
  }
}
