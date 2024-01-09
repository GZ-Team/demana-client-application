<template>
  <d-error v-if="hasErrorOccured" :error="error" />
  <router-view v-else />
</template>

<script setup lang="ts">
import { ref, computed, onErrorCaptured } from 'vue';


import type { Ref } from 'vue'
import type { DemanaError } from './types';

const error = ref(null) as Ref<DemanaError | null>

const hasErrorOccured = computed(() => !!error.value)

onErrorCaptured(({ name, message, stack }, _instance, info) => {
  error.value = { name, message, stack, info }
})
</script>
