<script setup lang="ts">
import { computed } from 'vue';
import { useDisplay } from 'vuetify';

import useTranslations from '@ui/composables/useTranslations';

const { xl, lg, md, sm, xs, smAndUp } = useDisplay();

const titleClasses = computed(() => ({
  'page-title-xl': xl,
  'page-title-lg': lg,
  'page-title-md': md,
  'page-title-sm': sm,
  'page-title-xs': xs
}));

const { translate } = useTranslations('pages.login.sections.intro');
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col :align="smAndUp ? 'center' : ''">
        <h2 :class="titleClasses">
          {{ translate('title') }}
        </h2>
      </v-col>
    </v-row>

    <v-row justify="space-around">
      <v-col :align="smAndUp ? 'center' : ''" cols="12" sm="10" md="8">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <p v-html="translate('text')" />
        <d-vertical-spacer />
      </v-col>
    </v-row>
  </v-container>
</template>
