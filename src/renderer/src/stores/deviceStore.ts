import { defineStore } from 'pinia'

export const useDeviceStore = defineStore('deviceStore', {
  state: () => ({
    usbPrinters: [] as Array<USBDevice>,
    serialPrinters: [] as Array<SerialPort>,
    selectedPrinter: null as USBDevice | null
  }),

  actions: {
    async loadAllUsbPrinters(): Promise<void> {
      try {
        this.usbPrinters = (await navigator.usb.getDevices())
          .filter(({ productName, configuration }) =>
            !!productName
            && !!configuration
            && Object.values(configuration.interfaces).some(({ alternate }) =>
              alternate.endpoints.some(({ direction, type }) =>
                // TODO: CHECK DIRECTION AND TYPE DOCUMENTATION
                ['in', 'out'].includes(direction) && type === 'bulk'
              )
            )
          )
          .sort((printerA, printerB) =>
            printerA.productName && printerB.productName && printerA.productName > printerB.productName ?
              1
              : printerA.productName && printerB.productName && printerB.productName > printerA.productName ? -1 : 0
          )
      } catch (exception) {
        console.error('Failed to load all USB printers:', exception)
      }
    },
    async loadAllSerialPrinters(): Promise<void> {
      try {
        this.serialPrinters = await navigator.serial.getPorts()
      } catch (exception) {
        console.error('Failed to load all serial printers printers:', exception)
      }
    },
    async loadAllPrinters(): Promise<void> {
      try {
        await Promise.all([this.loadAllUsbPrinters(), this.loadAllSerialPrinters()])
      } catch (exception) {
        console.error('Failed to load all printers:', exception)
      }
    }
  }
})
