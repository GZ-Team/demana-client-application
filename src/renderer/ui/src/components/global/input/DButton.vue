<script setup lang="ts">
const emit = defineEmits(['click']);

function handleClick(event: Event): void {
  emit('click', event);
}
</script>

<template>
  <button class="d-button" @click="handleClick">
    <slot />
  </button>
</template>
