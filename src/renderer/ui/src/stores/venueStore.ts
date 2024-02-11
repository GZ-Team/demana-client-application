import { defineStore } from 'pinia'

import useGraphQl from '@ui/composables/useGraphQl.ts'

import {useAppStore} from '@ui/stores/appStore.ts'

import type { VenueDto } from '@generated/graphql'

type StoreState = {
  venue: VenueDto | null;
};

export const useVenueStore = defineStore('venueStore', {
    state: (): StoreState => ({
        venue: null
    }),

    actions: {
        async registerDesktopApplication() {
            try {
                return await useGraphQl().mutate<string>({
                    mutation: 'venue.registerDesktopApplication',
                    key: 'registerDesktopApplication',
                    successMessage: 'globals.notifications.venue.register-desktop-application',
                    async onSuccess(data) {
                        if(!data) {
                            return
                        }

                        await useAppStore().setAppId(data)
                    },
                })
            } catch (exception) {
                throw new Error(`Failed to register this desktop application: ${(exception as Error).message}`, {
                    cause: exception
                })
            }
        }
    }
})
