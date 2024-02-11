import en from './en'
import ca from './ca'
import es from './es'

import type { DemanaLocaleCode, DemanaLocaleTranslation } from '@root/types'

const localeTranslations = {
    en,
    ca,
    es
} as Record<DemanaLocaleCode, DemanaLocaleTranslation>

export const availableLocaleCodes: DemanaLocaleCode[] = Object.keys(
    localeTranslations
) as DemanaLocaleCode[]

export default localeTranslations
