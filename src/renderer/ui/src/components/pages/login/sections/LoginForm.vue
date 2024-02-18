<script setup lang="ts">
import { computed, onMounted, reactive, ref, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useVuelidate } from '@vuelidate/core'
import { email, required } from '@vuelidate/validators'
import { useReCaptcha } from 'vue-recaptcha-v3'

import { useAppStore } from '@ui/stores/appStore'
import { useAuthStore } from '@ui/stores/authStore'
import { useVenueStore } from '@ui/stores/venueStore'

import useTranslations from '@ui/composables/useTranslations'
import useFeedback from '@ui/composables/useFeedback'
import useLogger from '@ui/composables/useLogger'

import type { LoginForm } from '@generated/graphql'

const appStore = useAppStore()
const venueStore = useVenueStore()
const authStore = useAuthStore()

const props = defineProps({
    loading: { type: Boolean, default: false }
})

const isProcessing = ref<boolean>(false)

const loginForm = reactive<{
  email: string | null;
  password: string | null;
  verification: string | null;
}>({
    email: null,
    password: null,
    verification: null
})

const { loading } = toRefs(props)
const { appId } = storeToRefs(appStore)
const { venue } = storeToRefs(venueStore)

const { login, getUser } = authStore
const { registerDesktopApplication } = authStore
const { translate, createTranslatedValidator } = useTranslations('pages.login.sections.loginForm')
const { clearNotifications } = useFeedback()

const vuelidate = useVuelidate(
    {
        email: {
            required: createTranslatedValidator(required),
            email: createTranslatedValidator(email)
        },
        password: {
            required: createTranslatedValidator(required)
        }
    },
    loginForm
)

const errorMessages = computed(() =>
    vuelidate.value.$errors.reduce(
        (messages: Record<string, string[]>, { $propertyPath, $message }) => ({
            ...messages,
            [$propertyPath]: [...(messages[$propertyPath] || []), $message.toString()]
        }),
        {}
    )
)

const router = useRouter()
const reCaptcha = useReCaptcha()
const logger = useLogger({service: 'login-form'})

async function handleLogin(): Promise<void> {
    clearNotifications()

    const isValid = await vuelidate.value.$validate()

    if (!reCaptcha || !reCaptcha.instance.value) {
        logger.error('ReCaptcha is not available')
        return
    }

    if (isValid) {
        isProcessing.value = true

        loginForm.verification = await reCaptcha.instance.value!.execute('desktop_login')
        // this.$cookies.remove(this.$config.accessTokenName);
        // this.$cookies.remove(this.$config.refreshTokenName);

        const loginFeedback = await login(loginForm as LoginForm)

        isProcessing.value = false

        useFeedback(loginFeedback)

        if (loginFeedback.success) {
            await getUser()

            if (!appId.value) {
                await registerDesktopApplication()
            }

            // const redirectRouteName = this.$getSessionStorageValue(this.$config.redirectRouteCookieName);
            const redirectRouteName = null

            if (redirectRouteName) {
                // this.$removeSessionStorageValue(this.$config.redirectRouteCookieName);
                await router.push({ name: redirectRouteName })
            } else if (venue.value!.paused) {
                await router.push({ name: 'paused-subscription' })
            } else {
                console.log('HERE')
                await router.push({ path: '/configuration' })
            }
        }
    }
}

onMounted(async () => {
    if (reCaptcha && !reCaptcha.isLoaded) {
        await reCaptcha!.recaptchaLoaded()
    }
})
</script>

<template>
  <v-form autocomplete="on" @submit.prevent="handleLogin">
    <v-container fluid>
      <v-row no-gutters justify="center">
        <v-col cols="12">
          <v-text-field
            v-model="loginForm.email"
            filled
            rounded
            dense
            outlined
            background-color="white"
            demana-token="email-address"
            :hide-details="!errorMessages.email"
            name="email"
            :label="translate('emailAddress')"
            :error-messages="errorMessages.email"
            :error="!!errorMessages.email"
            :disabled="isProcessing || loading"
          />
        </v-col>

        <v-col cols="12">
          <v-text-field
            v-model="loginForm.password"
            filled
            rounded
            dense
            outlined
            background-color="white"
            :hide-details="!errorMessages.password"
            :label="translate('password')"
            demana-token="password"
            name="password"
            :disabled="isProcessing || loading"
            :error-messages="errorMessages.password"
            :error="!!errorMessages.password"
            type="password"
          />
        </v-col>

        <v-col cols="9" sm="6" md="6" lg="5" xl="4">
          <v-btn
            block
            demana-token="login"
            :loading="isProcessing || loading"
            color="secondary"
            class="mooned"
            type="submit"
          >
            {{ translate('actions.login') }}
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
