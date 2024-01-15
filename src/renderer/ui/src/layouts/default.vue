<script setup lang="ts">
import MainFrame from '../components/MainFrame.vue';
</script>

<template>
  <v-layout>
    <main-frame />

    <v-main>
      <router-view />
    </v-main>
  </v-layout>
</template>
