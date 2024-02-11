import StorageService from './storageService'

import type { DemanaPreferences, Optional } from '@root/types'
import type { DemanaService } from '../types'

export default class PreferencesServices extends StorageService implements DemanaService {
    constructor() {
        super('userData', 'configuration.json')
    }

    get preferences(): DemanaPreferences {
        return (super.get('preferences') || { language: null }) as DemanaPreferences
    }

    set preferences(newPreferences: Optional<DemanaPreferences, 'language'>) {
        super.set('preferences', {
            ...this.preferences,
            ...newPreferences
        })
    }

    setDefaultValues(options: Optional<DemanaPreferences, 'language'>) {
        const defaultPreferences: DemanaPreferences = {
            language: options.language ?? 'en'
        }

        super.setDefaultValues('preferences', defaultPreferences)
    }
}
