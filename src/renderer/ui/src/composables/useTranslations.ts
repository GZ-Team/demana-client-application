import { useI18n } from "vue-i18n"
import { createI18nMessage } from '@vuelidate/validators'

import type { ValidationRule } from '@vuelidate/core'

export default function (scope?: string) {
    const { t } = useI18n()

    function translate(key: string, context: Record<string, unknown> = {}) {
        return t([scope, key].join('.'), context)
    }

    function createTranslatedValidator(validator: ValidationRule): ValidationRule {
        const withI18nMessage = createI18nMessage({ t })
        return withI18nMessage(
            validator,
            {
                messagePath: ({ $validator }) => `globals.validation.general.${$validator}`,
                messageParams: ({ max, min, ...otherParams }) => ({
                    ...otherParams,
                    maxValue: max,
                    minValue: min,
                    maxLength: max,
                    minLength: min,
                })
            }
        )
    }

    return {
        translate,
        createTranslatedValidator
    }
}