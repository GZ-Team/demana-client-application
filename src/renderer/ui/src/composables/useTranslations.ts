import { useI18n } from "vue-i18n"

export default function (scope?: string) {
    const { t } = useI18n()

    function translate(key: string, context: Record<string, unknown> = {}) {
        return t([scope, key].join('.'), context)
    }

    return {
        translate
    }
}