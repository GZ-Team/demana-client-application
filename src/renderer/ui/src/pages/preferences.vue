<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import useTranslations from '../composables/useTranslations'

import DLanguageSelector from '../components/DLanguageSelector.vue';

const { translate } = useTranslations('pages.preferences')
const { back } = useRouter()

function goBack() {
    return back()
}
</script>

<template>
    <v-container fluid>
        <d-vertical-spacer x-small />

        <v-row align="center">
            <v-col cols="auto">
                <v-btn exact small icon @click="goBack">
                    <d-icon name="mdi-chevron-left" />
                </v-btn>
            </v-col>
            <v-col cols="auto">
                <h1>
                    <span>{{ translate('title') }}</span>
                </h1>
            </v-col>
        </v-row>

        <v-row>
            <v-col class="top-pa-0">
                <v-divider />
            </v-col>
        </v-row>

        <d-vertical-spacer medium />

        <v-row>
            <v-col cols="6" class="top-pa-0">
                <v-container fluid class="pa-0">
                    <v-row dense>
                        <v-col>
                            <v-col class="input-field-title">
                                <p>
                                    {{ translate('applicationLanguage') }}
                                </p>
                            </v-col>
                        </v-col>
                    </v-row>

                    <v-row dense>
                        <v-col class="top-pa-0">
                            <d-language-selector />
                        </v-col>
                    </v-row>
                </v-container>
            </v-col>
        </v-row>
    </v-container>
</template>