<script lang="ts" setup>
import type { DemanaError } from '../types';

defineProps<{ error: DemanaError }>();
</script>

<template>
  <v-alert :title="`${error.name}: ${error.message}`" type="error" variant="outlined">
    <pre>{{ error.stack }}</pre>
  </v-alert>
</template>
