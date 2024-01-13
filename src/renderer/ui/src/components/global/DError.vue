<script lang="ts" setup>
import type { DemanaError } from '../../types';

defineProps<{ error: DemanaError }>();
</script>

<template>
  <section>
    <h1>{{ error.name }}: {{ error.message }}</h1>

    <pre>{{ error.stack }}</pre>
  </section>
</template>
