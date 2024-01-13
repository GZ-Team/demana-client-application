import type StorageService from './storageService';

export default class {
  constructor(private userDataStore: StorageService) {}

  get selectedPrinterId() {
    return this.userDataStore.get('selectedPrinterId');
  }

  set selectedPrinterId(newPrinterId: string) {
    this.userDataStore.set('selectedPrinterId', newPrinterId);
  }
}
