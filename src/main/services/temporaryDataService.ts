import { DemanaTemporaryData, Optional } from 'types';

import StorageService from './storageService';

export default class TemporaryDataService extends StorageService {
  constructor() {
    super('temp', 'temp.json');
  }

  get currentRouteName(): string | null {
    return (super.get('currentRouteName') as string) || null;
  }

  set currentRouteName(newRoute: string | null) {
    super.set('currentRouteName', newRoute);
  }

  get data(): Optional<DemanaTemporaryData, 'currentRouteName'> {
    return {
      currentRouteName: this.currentRouteName || undefined
    };
  }

  setDefaultValues(options: Optional<DemanaTemporaryData, 'currentRouteName'> = {}) {
    const { currentRouteName } = options;

    super.setDefaultValues('currentRouteName', currentRouteName || null);
  }
}
