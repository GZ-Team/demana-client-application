<script setup lang="ts">
defineProps({
    title: { type: String, required: true }
})

function goBack(): void {}
</script>

<template>
  <d-vertical-spacer x-small />

  <v-row align="center">
    <v-col cols="auto">
      <v-btn exact small icon @click="goBack">
        <d-icon name="mdi-chevron-left" />
      </v-btn>
    </v-col>
    <v-col cols="auto">
      <h1>
        <span>{{ title }}</span>
      </h1>
    </v-col>
  </v-row>

  <v-row>
    <v-col class="top-pa-0">
      <v-divider />
    </v-col>
  </v-row>

  <d-vertical-spacer medium />
</template>
