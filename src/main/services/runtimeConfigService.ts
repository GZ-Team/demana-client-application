import { getEnvironmentMode, isLocal, isDev } from '../utils/environmentUtils'

import type { DemanaService } from '../types'

export default class RuntimeConfigService implements DemanaService {
    get runtimeConfig(): ImportMetaEnv {
        return import.meta.env
    }

    get mode(): string {
        return getEnvironmentMode()
    }

    get isLocal(): boolean {
        return isLocal()
    }

    get isDev(): boolean {
        return isDev()
    }
}
