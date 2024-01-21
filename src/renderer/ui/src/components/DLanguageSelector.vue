<script setup lang="ts">
import { computed } from 'vue'

import useTranslations from '../composables/useTranslations'

import { getFlagIconForLocaleTag } from '../assets/icons';

import type { DemanaLocaleCode } from '../../../../types';

const { locale, availableLocaleCodes, translate, setLocale } = useTranslations('globals.languages')

defineProps({
    options: { type: Array, default: null },
    icons: { type: Boolean, default: false },
    labelKey: { type: String, default: 'label' },
    valueKey: { type: String, default: 'key' },
    iconsOnly: { type: Boolean, default: false }
})

const selectedLanguage = computed<DemanaLocaleCode>({
    get() {
        return locale.value as DemanaLocaleCode
    },
    async set(newLanguage) {
        await setLocale(newLanguage)
    }
})

const languageOptions = computed(() =>
    availableLocaleCodes.value
        .map(localeCode => {
            let localeOption: { key: DemanaLocaleCode, label?: string, icon: string } = {
                key: localeCode,
                icon: (getFlagIconForLocaleTag(localeCode) || {}).name
            }

            switch (localeCode) {
                case 'en':
                    localeOption.label = translate('english')
                    break;
                case 'ca':
                    localeOption.label = translate('catalan')
                    break;
                case 'es':
                    localeOption.label = translate('spanish')
                    break;
            }

            return localeOption
        })
        .filter(({ label, icon }) => !!label && !!icon)
)
</script>

<template>
    <v-select v-model="selectedLanguage" variant="solo" rounded hide-details :item-title="labelKey" :item-value="valueKey"
        :items="languageOptions" />
</template>