<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { VIcon, VAvatar } from 'vuetify/lib/components/index.mjs'

import { icons } from '@ui/assets/icons'

const props = defineProps({
    name: { type: String, required: true },
    xxSmall: { type: Boolean, default: false },
    xSmall: { type: Boolean, default: false },
    small: { type: Boolean, default: false },
    smedium: { type: Boolean, default: false },
    medium: { type: Boolean, default: false },
    slarge: { type: Boolean, default: false },
    large: { type: Boolean, default: false },
    rotate: { type: [String, Number], default: undefined },
    right: { type: Boolean, default: false },
    left: { type: Boolean, default: false },
    fill: { type: String, default: 'initial' },
    disabled: { type: Boolean, default: false },
    stripe: { type: Boolean, default: false },
    rounded: { type: Boolean, default: false },
    active: { type: Boolean, default: false },
    activeClass: { type: String, default: 'active-icon' }
})

const iconContainerElement = computed(() => {
    const { href } = useAttrs()

    if (href) {
        return 'a'
    }

    if (props.rounded) {
        return VAvatar
    }

    return 'div'
})

const parsedIconName = computed(() =>
    (props.name || '')
        .split('-')
        .map((part, partIndex) =>
            partIndex ? part.charAt(0).toUpperCase() + part.slice(1).toLowerCase() : part
        )
        .join('')
)

const isCustomIcon = computed(() => !!icons[parsedIconName.value])

const selectedIcon = computed(() => {
    if (parsedIconName.value) {
        if (!isCustomIcon.value) {
            return VIcon
        }

        return 'img'
    }

    return 'div'
})

const iconContent = computed(() => (isCustomIcon.value ? icons[parsedIconName.value].icon : null))

const classes = computed(() => ({
    icon: isCustomIcon.value,
    [props.activeClass]: props.active && !props.rounded,
    'icon-xxsmall': isCustomIcon.value && props.xxSmall,
    'icon-xsmall': isCustomIcon.value && props.xSmall,
    'icon-small': isCustomIcon.value && props.small,
    'icon-smedium': isCustomIcon.value && props.smedium,
    'icon-medium': isCustomIcon.value && props.medium,
    'icon-slarge': isCustomIcon.value && props.slarge,
    'icon-large': isCustomIcon.value && props.large,
    'icon--disabled': props.disabled,
    'icon-full': props.rounded,
    right: props.right,
    left: props.left,
    stripe: props.stripe
}))

const containerClasses = computed(() => {
    let containerClasses: Record<string, boolean> = {
        'icon-container': true
    }

    if (props.rounded) {
        containerClasses = {
            'icon-rounded': true,
            ...containerClasses,
            ...classes.value,
            [props.activeClass]: props.active && props.rounded,
            'icon-full': false
        }
    }

    return containerClasses
})
</script>

<template>
  <component :is="iconContainerElement" :class="containerClasses" :size="null" v-bind="$attrs">
    <component
      :is="selectedIcon"
      v-if="isCustomIcon"
      :style="{ transform: `rotate(${rotate}deg)` }"
      :fill="fill"
      :color="fill"
      :class="classes"
      :icon="name"
      :src="iconContent"
    />
    <component
      :is="selectedIcon"
      v-else
      :style="{ transform: `rotate(${rotate}deg)` }"
      :fill="fill"
      :color="fill"
      :class="classes"
      :icon="name"
    />
  </component>
</template>

<style lang="scss" scoped>
div.icon-container {
  display: inline-block;
}

.icon {
  height: 2rem;
  width: 2rem;

  &-xxsmall {
    height: 0.5rem;
    width: 0.5rem;
  }

  &-xsmall {
    height: 1.25rem;
    width: 1.25rem;
  }

  &-small {
    height: 1.5rem;
    width: 1.5rem;
  }

  &-smedium {
    height: 2.5rem;
    width: 2.5rem;
  }

  &-medium {
    height: 4rem;
    width: 4rem;
  }

  &-slarge {
    height: 5rem;
    width: 5rem;
  }

  &-large {
    height: 6rem;
    width: 6rem;
  }

  &--disabled {
    opacity: 0.5;
  }

  &-full {
    height: 100%;
    width: 100%;
  }
}

.right {
  margin-left: 0.25rem;
}

.left {
  margin-right: 0.25rem;
}

.stripe {
  height: 10%;
  width: 48%;
}
</style>
