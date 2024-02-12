<script setup lang="ts">
import { computed, toRefs } from 'vue'

import useTranslations from '@ui/composables/useTranslations'

import type { DemanaNotification } from '@ui/composables/useNotifications'

type DNotificationOptions = DemanaNotification & {
  messageId?: string | number
  modelValue?: boolean
  message?: string
  location?: string
  timeout?: number
}

const emit = defineEmits(['modelValue:update', 'show', 'hide'])

const props = withDefaults(defineProps<DNotificationOptions>(), {
    modelValue: true,
    type: 'info',
    location: 'right top',
    timeout: -1
})

const { modelValue, messageId, message, type, location, timeout } = toRefs(props)

const computedId = computed(() => messageId.value ?? message.value)

const shown = computed<boolean>({
    get() {
        return modelValue.value
    },
    set(isShown) {
        emit('modelValue:update', isShown)
        isShown ? emit('show', computedId.value) : emit('hide', computedId.value)
    }
})

const {translate} = useTranslations()
</script>

<template>
  <v-snackbar v-model="shown" close-on-content-click :color="type" position="sticky" :timeout="timeout" :location="location" multi-line>
    {{ translate(message) }}
  </v-snackbar>
</template>
