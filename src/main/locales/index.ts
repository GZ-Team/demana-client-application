import en from './en';
import ca from './ca';
import es from './es';

import type { DemanaLocaleTranslation } from '../../types';

export default {
  en,
  ca,
  es
} as { [key: string]: DemanaLocaleTranslation | undefined };
