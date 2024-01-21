import type StorageService from './storageService';
import type { DemanaPreferences, Optional } from 'types';

export default class {
  constructor(private userDataStore: StorageService) { }

  get preferences(): DemanaPreferences {
    return this.userDataStore.get('preferences') as DemanaPreferences;
  }

  set preferences(newPreferences: Optional<DemanaPreferences, 'language'>) {
    this.userDataStore.set('preferences', {
      ...this.preferences,
      ...newPreferences
    })
  }

  setDefaultValues(options: DemanaPreferences) {
    const defaultPreferences: DemanaPreferences = {
      language: options.language ?? 'en'
    }

    this.userDataStore.setDefaultValues('preferences', defaultPreferences)
  }
}
