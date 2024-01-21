<template>
  <v-app v-if="!loading">
    <d-error v-if="hasErrorOccured" :error="error" />

    <router-view v-else />
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, onErrorCaptured, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';

import { useAppStore } from './stores/appStore';

import useTranslations from './composables/useTranslations';

import DError from './components/DError.vue';

import type { Ref } from 'vue';
import type { DemanaError } from './types';

const loading = ref(true)
const error = ref(null) as Ref<DemanaError | null>;

const hasErrorOccured = computed(() => !!error.value);

const { currentRoute, replace } = useRouter()
const { loadPreferences, loadAvailableLocaleCodes } = useAppStore()
const { setupI18n } = useTranslations()

onBeforeMount(async () => {
  if (!currentRoute.value.name) {
    replace({ name: 'PrinterConfiguration' });
  }

  await Promise.all([
    loadPreferences(),
    loadAvailableLocaleCodes()
  ])

  await setupI18n()

  loading.value = false
});

onErrorCaptured(({ name, message, stack }, _instance, info) => {
  error.value = { name, message, stack, info };
});
</script>
