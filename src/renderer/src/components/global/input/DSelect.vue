<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: null },
  options: {
    type: Array<Record<string, string | number>>,
    required: true,
    validator(options: Array<Record<string, string>>) {
      return options.every((option) =>
        Object.keys(option).every((optionProp) => ['key', 'label'].includes(optionProp))
      )
    }
  }
})

const emit = defineEmits(['update:modelValue'])

const computedValue = computed({
  get() {
    return props.modelValue
  },
  set(newValue) {
    emit('update:modelValue', newValue)
  }
})
</script>

<template>
  <select v-model="computedValue" class="d-select">
    <option v-for="({ key, label }, optionIndex) in options" :key="`options-${optionIndex}-${key}`" :value="key">
      {{ label }}
    </option>
  </select>
</template>
