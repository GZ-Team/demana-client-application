import type StorageService from './storageService';
import type { DemanaPrintingConfiguration } from 'types';

export default class {
  constructor(private userDataStore: StorageService) { }

  get selectedPrinterId(): string {
    return this.userDataStore.get('selectedPrinterId');
  }

  set selectedPrinterId(newPrinterId: string) {
    this.userDataStore.set('selectedPrinterId', newPrinterId);
  }

  get printingConfiguration(): DemanaPrintingConfiguration {
    return this.userDataStore.get('printingConfiguration');
  }

  set printingConfiguration(newPrintingConfiguration: DemanaPrintingConfiguration) {
    this.userDataStore.set('printingConfiguration', newPrintingConfiguration)
  }
}
