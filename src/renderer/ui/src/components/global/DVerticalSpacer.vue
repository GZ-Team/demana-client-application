<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  margin: { type: String, default: null },
  xSmall: { type: Boolean, default: false },
  small: { type: Boolean, default: false },
  medium: { type: Boolean, default: false },
  large: { type: Boolean, default: false },
  xLarge: { type: Boolean, default: false },
  xxLarge: { type: Boolean, default: false }
});

const classes = computed(() => ({
  'vertical-spacer-x-small': props.xSmall,
  'vertical-spacer-small': props.small,
  'vertical-spacer-medium': props.medium,
  'vertical-spacer-large': props.large,
  'vertical-spacer-x-large': props.xLarge,
  'vertical-spacer-xx-large': props.xxLarge
}));

const style = computed(() => ({
  'margin-top': props.margin
}));
</script>

<template>
  <div class="vertical-spacer" :class="classes" :style="style" />
</template>

<style scoped lang="scss">
.vertical-spacer {
  height: 1rem;
  margin-top: 2rem;

  &-x-small {
    margin-top: 0.5rem;
  }

  &-small {
    margin-top: 1rem;
  }

  &-medium {
    margin-top: 3rem;
  }

  &-large {
    margin-top: 4rem;
  }

  &-x-large {
    margin-top: 6rem;
  }

  &-xx-large {
    margin-top: 10rem;
  }
}
</style>
