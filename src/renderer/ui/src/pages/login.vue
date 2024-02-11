<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { useAppStore } from '@ui/stores/appStore'

import useTranslations from '@ui/composables/useTranslations'

import IntroSection from '@ui/components/pages/login/sections/IntroSection.vue'
import LoginForm from '@ui/components/pages/login/sections/LoginForm.vue'

const loading = ref(true)

const { translate } = useTranslations('pages.login')
const { createBackofficeLink } = useAppStore()

onMounted(() => {
    loading.value = false
})
</script>

<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" class="pa-0">
        <intro-section />

        <v-row no-gutters justify="center">
          <v-col cols="12" sm="9" md="8" lg="6" xl="4">
            <login-form :loading="loading" />
          </v-col>
        </v-row>

        <v-row>
          <v-col align="center" cols="12" class="login-actions">
            <p>
              <d-link
                class="button demana-link"
                :to="createBackofficeLink('forgot-password')"
                demana-token="forgot-password"
              >
                {{ translate('sections.actions.forgotPassword') }}
              </d-link>
            </p>
          </v-col>
        </v-row>

        <v-row>
          <v-col align="center" cols="12">
            <p>
              <span class="button">
                {{ translate('sections.actions.register.pre-link') }}
              </span>
              <d-link
                class="button demana-link"
                :to="{ path: createBackofficeLink('register') }"
                demana-token="login-register"
              >
                {{ translate('sections.actions.register.link') }}
              </d-link>
            </p>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <d-vertical-spacer x-large />
    <d-vertical-spacer x-large />
  </v-container>
</template>

<style scoped>
.login-actions {
  margin-top: 4rem;
}
</style>
