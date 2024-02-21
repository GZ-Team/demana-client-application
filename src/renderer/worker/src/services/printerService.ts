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

        if (!selectedPrinterId) {
            return null
        }

        const selectedUsbPrinter = allUsbPrinters.find(
            ({ productId }) => productId === parseInt(selectedPrinterId.toString())
        )

        const selectedSerialPrinter = allSerialPrinters
            .find(port => Object.values(port.getInfo())
                .map(detail => `${detail}`)
                .includes(`${selectedPrinterId}`)
            )

        let selectedPrinter: USBDevice | SerialPort | undefined = selectedUsbPrinter
        let type = 'usb'

        if (!selectedUsbPrinter && selectedSerialPrinter) {
            selectedPrinter = selectedSerialPrinter
            type = 'serial'
        }

        if (!selectedPrinter) {
            return null
        }

        console.log({selectedPrinter, type})

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
