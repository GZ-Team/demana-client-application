import { availableLocaleCodes } from '../locales';

import type { DemanaLocaleCode } from '@root/types';

export function parseLocale(
  value: string,
  defaultLocale: DemanaLocaleCode = 'en'
): DemanaLocaleCode {
  return (
    availableLocaleCodes.find((localeCode) =>
      value.toLowerCase().includes(localeCode.toLowerCase())
    ) || defaultLocale
  );
}
