<template>
  <d-error v-if="hasErrorOccured" :error="error" />
  <router-view v-else />
</template>

<script setup lang="ts">
import { ref, computed, onErrorCaptured, onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import type { Ref } from 'vue';
import type { DemanaError } from './types';
import type { DemanaMessage } from '../../../types';

const error = ref(null) as Ref<DemanaError | null>;

const hasErrorOccured = computed(() => !!error.value);

onBeforeMount(() => {
  if (!useRoute().name) {
    useRouter().replace({ name: 'Printers' });
  }
});

onErrorCaptured(({ name, message, stack }, _instance, info) => {
  error.value = { name, message, stack, info };
});

window.api['@messages:new'](async (message: DemanaMessage) => {
  console.log({ message });
});
</script>
