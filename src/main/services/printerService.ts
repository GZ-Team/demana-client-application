import type StorageService from './storageService';
import type { DemanaPrintingConfiguration } from 'types';

export default class {
  constructor(private userDataStore: StorageService) { }

  get selectedPrinterId(): string {
    return this.userDataStore.get('selectedPrinterId') as string;
  }

  set selectedPrinterId(newPrinterId: string) {
    this.userDataStore.set('selectedPrinterId', newPrinterId);
  }

  get printingConfiguration(): DemanaPrintingConfiguration {
    return this.userDataStore.get('printingConfiguration') as DemanaPrintingConfiguration;
  }

  set printingConfiguration(newPrintingConfiguration: DemanaPrintingConfiguration) {
    this.userDataStore.set('printingConfiguration', newPrintingConfiguration)
  }

  setDefaultValues() {
    const defaultPrintingConfiguration: DemanaPrintingConfiguration = {
      automatic: true,
      paperMargin: 1,
      paperWidth: 10
    }

    this.userDataStore.setDefaultValues('printingConfiguration', defaultPrintingConfiguration)
  }
}
