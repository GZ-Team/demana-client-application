<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia';

import { useDeviceStore } from '../stores/deviceStore'
import { Printer } from '../models/printer';

const deviceStore = useDeviceStore()
const { loadAllPrinters } = deviceStore
const { usbPrinters, selectedPrinter } = storeToRefs(deviceStore)

const printersAsOptions = computed(() =>
  //TODO: show serial printers too
  usbPrinters.value.map(({ productId, productName }) => ({ key: productId, label: productName?.replace('\u0000', '') }))
)

const computedSelectedPrinterId = computed({
  get() {
    return selectedPrinter.value?.productId
  },
  set(newPrinterId) {
    selectedPrinter.value = newPrinterId ? usbPrinters.value.find(({ productId }) => productId === newPrinterId) || null : null

    if (selectedPrinter.value) {
      window.api.setSelectedPrinter(selectedPrinter.value.productId)
    }
  }
})

async function handlePrinterTest(): Promise<void> {
  if (!selectedPrinter.value) {
    return
  }

  const printer = new Printer(selectedPrinter.value)

  await printer.printText('')
}

onMounted(async () => {
  await loadAllPrinters()
})
</script>

<template>
  <d-grid rows>
    <h1>Printers</h1>

    <d-select v-model="computedSelectedPrinterId" :options="printersAsOptions" />

    <d-button :disabled="!selectedPrinter" @click="handlePrinterTest">Test</d-button>
  </d-grid>
</template>
