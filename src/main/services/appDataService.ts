import StorageService from './storageService'

import type { DemanaService } from '../types'

export default class AppDataService extends StorageService implements DemanaService {
    constructor() {
        super('appData', 'appData.json')
    }

    get appId(): string {
        return super.get('id') as string
    }

    set appId(newAppId: string) {
        super.set('id', newAppId)
    }
}
