import { Printer } from '../models/printer'

import useLogger from '../utils/loggingUtils'

export default class PrinterService {
    private logger = useLogger({ service: 'PrinterService' })

    async getSelectedPrinter(): Promise<Printer | null> {
        const [selectedPrinterId, allUsbPrinters] = await Promise.all([
            window.api.getSelectedPrinter(),
            navigator.usb.getDevices()
        ])

        console.log({selectedPrinterId, allUsbPrinters})

        if (!selectedPrinterId) {
            return null
        }

        const selectedUsbPrinter = allUsbPrinters.find(
            ({ productId }) => productId === parseInt(selectedPrinterId.toString())
        )

        if (!selectedUsbPrinter) {
            return null
        }

        return new Printer(selectedUsbPrinter)
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
