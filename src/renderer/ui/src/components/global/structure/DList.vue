<script setup lang="ts">
defineProps({
  items: { type: Array, default: () => [] }
});
</script>

<template>
  <d-grid class="d-list" no-padding rows>
    <slot
      v-for="(item, itemIndex) in items"
      :key="`items-item-${itemIndex}`"
      :item="item"
      :index="itemIndex"
    >
      <pre>{{ item }}</pre>
    </slot>
  </d-grid>
</template>
