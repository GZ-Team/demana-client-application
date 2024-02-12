<script setup lang="ts">
import { ref, computed, onErrorCaptured, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'

import { useAppStore } from '@ui/stores/appStore'

import useTranslations from '@ui/composables/useTranslations'
import useLogger from '@ui/composables/useLogger'
import useNotifications from '@ui/composables/useNotifications'

import DError from '@ui/components/DError.vue'

import type { Ref } from 'vue'
import type { DemanaError } from './types'

const notifications = useNotifications()

const loading = ref(true)
const error = ref(null) as Ref<DemanaError | null>

const hasErrorOccured = computed(() => !!error.value)

const { getAppId, loadPreferences, loadAvailableLocaleCodes } = useAppStore()
const { setupI18n } = useTranslations()

function removeNotification(key: string) {
    const notificationIndex = parseInt(key)

    if (notifications.value.length > notificationIndex) {
        notifications.value.splice(notificationIndex, 1)
    }
}

const logger = useLogger({ service: 'App' })
const router = useRouter()

onBeforeMount(async () => {
    await Promise.all([getAppId(), loadPreferences(), loadAvailableLocaleCodes()])

    await setupI18n()

    loading.value = false

    window.api['@messages:new'](async (message) => {
        console.log({ message })
    })

    window.api['@window:external-navigation'](async (route) => {
        router.push({ name: route })
    })

    window.api['@session:authenticated'](async (authenticated) => {
        logger.info(`New session authenticated status: ${authenticated}`)
    })
})

onErrorCaptured(({ name, message, stack }, _instance, info) => {
    error.value = { name, message, stack, info }
})
</script>

<template>
  <v-app v-if="!loading">
    <d-notification v-for="(notification, notificationIndex) in notifications"
                    :key="`notification-${notificationIndex}`"
                    :message-id="notificationIndex"
                    :message="notification.message" :type="notification.type" @hide="removeNotification" />

    <d-error v-if="hasErrorOccured" :error="(error as DemanaError)" />
    <router-view v-else />
  </v-app>
</template>
