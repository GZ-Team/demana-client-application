import { storeToRefs } from 'pinia';

import { useAppStore } from '../stores/appStore'

import type { Plugin } from "vue";

export default {
    install() {
        const { state } = storeToRefs(useAppStore())

        window.api['@messages:new'](async (message) => {
            console.log({ message });
        });

        window.api['@window:new'](async (windowState) => {
            state.value = windowState
        });
    }
} as Plugin