<template>
  <v-app>
    <d-error v-if="hasErrorOccured" :error="error" />
    <router-view v-else />
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, onErrorCaptured, onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

import { useAppStore } from './stores/appStore'

import type { Ref } from 'vue';
import type { DemanaError } from './types';

const appStore = useAppStore()

const error = ref(null) as Ref<DemanaError | null>;

const hasErrorOccured = computed(() => !!error.value);

const { state } = storeToRefs(appStore)

onBeforeMount(() => {
  if (!useRoute().name) {
    useRouter().replace({ name: 'Printers' });
  }
});

onErrorCaptured(({ name, message, stack }, _instance, info) => {
  error.value = { name, message, stack, info };
});

window.api['@messages:new'](async (message) => {
  console.log({ message });
});

window.api['@window:new'](async (windowState) => {
  state.value = windowState
});
</script>
