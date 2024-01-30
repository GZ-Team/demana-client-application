<template>
  <v-app v-if="!loading">
    <d-error v-if="hasErrorOccured" :error="error" />

    <router-view v-else />
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, onErrorCaptured, onBeforeMount } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

import { useAppStore } from './stores/appStore';

import useTranslations from './composables/useTranslations';

import DError from './components/DError.vue';

import type { Ref } from 'vue';
import type { DemanaError } from './types';

const loading = ref(true);
const error = ref(null) as Ref<DemanaError | null>;

const hasErrorOccured = computed(() => !!error.value);

const { loadPreferences, loadAvailableLocaleCodes, loadRuntimeConfiguration } = useAppStore();
const { setupI18n } = useTranslations();

const router = useRouter();

onBeforeMount(async () => {
  await Promise.all([loadPreferences(), loadAvailableLocaleCodes(), loadRuntimeConfiguration()]);

  await setupI18n();

  loading.value = false;

  window.api['@messages:new'](async (message) => {
    console.log({ message });
  });

  window.api['@window:new'](async (windowState) => {
    const { state } = storeToRefs(useAppStore());
    state.value = windowState;
  });

  window.api['@window:external-navigation'](async (route) => {
    router.push({ name: route });
  });
});

onErrorCaptured(({ name, message, stack }, _instance, info) => {
  error.value = { name, message, stack, info };
});
</script>
