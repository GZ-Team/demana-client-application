import type { App } from 'vue';

import { usePrinterStore } from '../stores/printerStore';

export default {
  install: (_app: App) => {
    const { loadAllUsbPrinters, loadAllSerialPrinters } = usePrinterStore();

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
