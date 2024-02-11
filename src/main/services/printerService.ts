import StorageService from './storageService'

import type { DemanaPrintingConfiguration } from '@root/types'
import type { DemanaService } from '../types'

export default class PrinterService extends StorageService implements DemanaService {
    constructor() {
        super('userData', 'configuration.json')
    }

    get selectedPrinterId(): string {
        return super.get('selectedPrinterId') as string
    }

    set selectedPrinterId(newPrinterId: string) {
        super.set('selectedPrinterId', newPrinterId)
    }

    get printingConfiguration(): DemanaPrintingConfiguration {
        return super.get('printingConfiguration') as DemanaPrintingConfiguration
    }

    set printingConfiguration(newPrintingConfiguration: DemanaPrintingConfiguration) {
        super.set('printingConfiguration', newPrintingConfiguration)
    }

    setDefaultValues() {
        const defaultPrintingConfiguration: DemanaPrintingConfiguration = {
            automatic: true,
            paperMargin: 1,
            paperWidth: 10
        }

        super.setDefaultValues('printingConfiguration', defaultPrintingConfiguration)
    }
}
