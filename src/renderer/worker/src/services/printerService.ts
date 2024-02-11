import { Printer } from '../models/printer'

import useLogger from '../utils/loggingUtils'

export default class PrinterService {
    private logger = useLogger({ service: 'PrinterService' })

    async getSelectedPrinter(): Promise<Printer | null> {
        const [selectedPrinterId, allUsbPrinters] = await Promise.all([
            window.api.getSelectedPrinter(),
            navigator.usb.getDevices()
        ])

        const selectedUsbPrinter = allUsbPrinters.find(
            ({ productId }) => productId === selectedPrinterId
        )

        if (!selectedUsbPrinter) {
            return null
        }

        return new Printer(selectedUsbPrinter)
    }

    async print(): Promise<void> {
        try {
            const selectedPrinter = await this.getSelectedPrinter()

            throw new Error('Printing is not implemented yet.', { cause: selectedPrinter })

            // await printer.printText('')
        } catch (exception) {
            this.logger.warning(`Failed to print: ${(exception as Error).message}`)
        }
    }
}
