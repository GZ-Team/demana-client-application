import StorageService from './storageService';

import type { DemanaPreferences, Optional } from 'types';

export default class PreferencesServices extends StorageService {
  constructor() {
    super('userData', 'configuration.json');
  }

  get preferences(): DemanaPreferences {
    return (super.get('preferences') || { language: null }) as DemanaPreferences;
  }

  set preferences(newPreferences: Optional<DemanaPreferences, 'language'>) {
    super.set('preferences', {
      ...this.preferences,
      ...newPreferences
    });
  }

  setDefaultValues(options: Optional<DemanaPreferences, 'language'>) {
    const defaultPreferences: DemanaPreferences = {
      language: options.language ?? 'en'
    };

    super.setDefaultValues('preferences', defaultPreferences);
  }
}
