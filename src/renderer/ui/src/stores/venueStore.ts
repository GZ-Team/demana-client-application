import { defineStore } from 'pinia';

import { VenueDto } from '@generated/graphql';

type StoreState = {
  venue: VenueDto | null;
};

export const useVenueStore = defineStore('venueStore', {
  state: (): StoreState => ({
    venue: null
  }),

  actions: {
    loadVenueById() {
      try {
      } catch (exception) {
        throw new Error(`Failed to load venue by id: ${(exception as Error).message}`, {
          cause: exception
        });
      }
    }
  }
});
