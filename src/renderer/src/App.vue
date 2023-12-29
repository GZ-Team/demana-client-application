<template>
  <router-view />
</template>

<script setup lang="ts">
// TODO: MOVE TO PLUGIN
import { useDeviceStore } from '../src/stores/deviceStore'

const { loadAllUsbPrinters, loadAllSerialPrinters } = useDeviceStore()

navigator.usb.addEventListener('connect', async (event) => {
  await loadAllUsbPrinters()
});

navigator.usb.addEventListener('disconnect', async (event) => {
  await loadAllUsbPrinters()
});

navigator.serial.addEventListener('connect', async (event) => {
  await loadAllSerialPrinters()
});

navigator.serial.addEventListener('disconnect', async (event) => {
  await loadAllSerialPrinters()
});
</script>
