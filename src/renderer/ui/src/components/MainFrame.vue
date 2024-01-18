<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';

import { useAppStore } from '../stores/appStore'

const appStore = useAppStore()

const { minimizeWindow, maximizeWindow, restoreWindow, closeWindow } = appStore
const { state } = storeToRefs(appStore)

const actions = computed(() => [
    {
        key: 'minimize',
        icon: 'mdi-window-minimize',
        clickAction: async () => await minimizeWindow(),
        inactive: !state.value.minimizable
    },
    {
        key: 'maximize',
        icon: 'mdi-window-maximize',
        clickAction: async () => {
            state.value.isMaximized = await maximizeWindow()
        },
        inactive: !state.value.maximizable || state.value.isMaximized
    },
    {
        key: 'restore',
        icon: 'mdi-window-restore',
        clickAction: async () => {
            state.value.isMaximized = await restoreWindow()
        },
        inactive: !state.value.maximizable || !state.value.isMaximized
    },
    {
        key: 'close',
        icon: 'mdi-window-close',
        clickAction: async () => await closeWindow(),
        inactive: !state.value.isClosable
    }
].filter(({ inactive }) => !inactive))

const { t } = useI18n()
</script>

<template>
    <v-app-bar elevation="0" density="compact">
        <template v-slot:prepend>
            <d-icon x-small name="demanaLogo" />
        </template>

        <v-app-bar-title>{{ t('globals.applicationName') }}</v-app-bar-title>

        <template v-slot:append>
            <v-btn v-for="({ key, icon, clickAction }) in actions" :key="`main-frame-action-${key}`" @click="clickAction">
                <d-icon :name="icon" />
            </v-btn>
        </template>
    </v-app-bar>
</template>