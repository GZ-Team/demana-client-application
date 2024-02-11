import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { createI18nMessage } from '@vuelidate/validators'

import { useAppStore } from '@ui/stores/appStore'

import type { ValidationRule } from '@vuelidate/core'
import type { DemanaLocaleCode } from '@root/types'

export default function (scope?: string) {
    const appStore = useAppStore()

    const { t, locale, fallbackLocale, setLocaleMessage } = useI18n({ useScope: 'global' })
    const { availableLocaleCodes, preferredLocaleCode } = storeToRefs(appStore)

    const { loadAllTranslations, updatePreferences } = appStore

    function translate(key: string, context: Record<string, unknown> = {}): string {
        return t([scope, key].filter(scopeStep => scopeStep).join('.'), context)
    }

    function createTranslatedValidator(validator: ValidationRule): ValidationRule {
        const withI18nMessage = createI18nMessage({ t })
        return withI18nMessage(validator, {
            messagePath: ({ $validator }) => `globals.validation.general.${$validator}`,
            messageParams: ({ max, min, ...otherParams }) => ({
                ...otherParams,
                maxValue: max,
                minValue: min,
                maxLength: max,
                minLength: min
            })
        })
    }

    async function setupI18n() {
        const translations = await loadAllTranslations()

        Object.entries(translations).forEach(([localeCode, localeTranslations]) =>
            setLocaleMessage(localeCode, localeTranslations)
        )

        locale.value = preferredLocaleCode.value
        fallbackLocale.value = preferredLocaleCode.value
    }

    async function setLocale(newLocaleCode: DemanaLocaleCode): Promise<void> {
        const { language } = await updatePreferences({ language: newLocaleCode })

        if (locale.value != language) {
            locale.value = language
        }
    }

    return {
        locale: computed<DemanaLocaleCode>(() => locale.value as DemanaLocaleCode),
        availableLocaleCodes,
        translate,
        createTranslatedValidator,
        setupI18n,
        setLocale,
        t
    }
}
