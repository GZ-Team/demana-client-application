<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  columns: { type: Boolean, default: true },
  rows: { type: Boolean, default: false },
  noPadding: { type: Boolean, default: false }
});

const useColumns = ref(!props.rows);

const computedClasses = computed(() => ({
  columns: useColumns.value,
  rows: !useColumns.value,
  padded: !props.noPadding
}));
</script>

<template>
  <div class="d-grid" :class="computedClasses">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.d-grid {
  display: grid;
  row-gap: 1rem;
  column-gap: 1rem;

  &.columns {
    grid-template-columns: 1fr;
  }

  &.rows {
    grid-template-rows: auto;
  }

  &.padded {
    padding: 0.5rem;
  }
}
</style>
