import { Printer, PrinterType } from '../models/printer'

import useLogger from '../utils/loggingUtils'

export default class PrinterService {
    private logger = useLogger({ service: 'PrinterService' })

    async getSelectedPrinter(): Promise<Printer | null> {
        const [selectedPrinterId, allUsbPrinters, allSerialPrinters] = await Promise.all([
            window.api.getSelectedPrinter(),
            navigator.usb.getDevices(),
            navigator.serial.getPorts()
        ])

        console.log({selectedPrinterId, allUsbPrinters})

        if (!selectedPrinterId) {
            return null
        }

        const selectedUsbPrinter = allUsbPrinters.find(
            ({ productId }) => productId === parseInt(selectedPrinterId.toString())
        )

        const selectedSerialPrinter = allSerialPrinters
            .find(port => port.getInfo().productId === selectedPrinterId.toString())

        const selectedPrinter = selectedUsbPrinter ?? selectedSerialPrinter
        let type = 'usb'

        if (selectedSerialPrinter) {
            type = 'serial'
        }

        if (!selectedPrinter) {
            return null
        }

        return new Printer(selectedPrinter, type as PrinterType)
    }

    async print(content): Promise<void> {
        try {
            const selectedPrinter = await this.getSelectedPrinter()

            if (!selectedPrinter) {
                throw new Error('There is no selected printer.')
            }

            await selectedPrinter.printText(content)
        } catch (exception) {
            this.logger.warning(`Failed to print: ${(exception as Error).message}`)
        }
    }
}
