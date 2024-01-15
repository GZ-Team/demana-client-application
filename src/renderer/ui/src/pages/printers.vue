<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';

import { useDeviceStore } from '../stores/deviceStore';

const deviceStore = useDeviceStore();
const { loadAllPrinters } = deviceStore;
const { usbPrinters, selectedPrinter } = storeToRefs(deviceStore);

const printersAsOptions = computed(() =>
  //TODO: show serial printers too
  usbPrinters.value.map(({ productId, productName }) => ({
    key: productId,
    label: productName?.replace('\u0000', '')
  }))
);

const computedSelectedPrinterId = computed({
  get() {
    return selectedPrinter.value?.productId;
  },
  set(newPrinterId) {
    selectedPrinter.value = newPrinterId
      ? usbPrinters.value.find(({ productId }) => productId === newPrinterId) || null
      : null;

    if (selectedPrinter.value) {
      window.api.setSelectedPrinter(selectedPrinter.value.productId);
    }
  }
});

async function handlePrinterTest(): Promise<void> {
  window.api.sendMessage({ target: 'worker', content: 'test-printer' });
}

onMounted(async () => {
  await loadAllPrinters();
});
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <h1>Printers</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-select v-model="computedSelectedPrinterId" no-data-text="No printers to be found" :items="printersAsOptions"
          item-title="label" item-value="key" />
      </v-col>
    </v-row>

    <v-row align="center" justify="space-around">
      <v-col cols="1">
        <v-btn @click="handlePrinterTest">Test</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
