import type { App } from 'vue';

import { useDeviceStore } from '../stores/deviceStore';

export default {
  install: (_app: App) => {
    const { loadAllUsbPrinters, loadAllSerialPrinters } = useDeviceStore();

    navigator.usb.addEventListener('connect', async (_event) => {
      await loadAllUsbPrinters();
    });

    navigator.usb.addEventListener('disconnect', async (_event) => {
      await loadAllUsbPrinters();
    });

    navigator.serial.addEventListener('connect', async (_event) => {
      await loadAllSerialPrinters();
    });

    navigator.serial.addEventListener('disconnect', async (_event) => {
      await loadAllSerialPrinters();
    });
  }
};
