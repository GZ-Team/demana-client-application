import { defineStore } from 'pinia'

import type { VenueDto } from '@generated/graphql'

type StoreState = {
  venue: VenueDto | null;
};

export const useVenueStore = defineStore('venueStore', {
    state: (): StoreState => ({
        venue: null
    })
})
