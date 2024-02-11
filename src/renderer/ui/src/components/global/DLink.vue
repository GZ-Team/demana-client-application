<script setup lang="ts">
import { toRefs, computed } from 'vue'

import { useAppStore } from '@ui/stores/appStore'

import type { RouterLinkProps, NavigationFailure } from 'vue-router'

type DLinkOptions = RouterLinkProps & {
  to: RouterLinkProps['to'] & {
    path?: string;
  };
};

const props = defineProps<DLinkOptions>()

const { to } = toRefs(props)

const url = computed(() => (typeof to.value === 'string' ? to.value : to.value.path || ''))

const isExternalLink = computed<boolean>(() =>
    ['http://', 'http://'].some((handler) =>
        url.value.startsWith('/') ? url.value.substring(1) : url.value.startsWith(handler)
    )
)

const { openExternalLink } = useAppStore()

async function handleExternalLink(_event: MouseEvent): Promise<void | NavigationFailure> {
    if (isExternalLink.value) {
        return openExternalLink(url.value)
    }
}
</script>

<template>
  <a v-if="isExternalLink" @click="handleExternalLink">
    <slot />
  </a>
  <router-link v-else v-bind="props">
    <slot />
  </router-link>
</template>
