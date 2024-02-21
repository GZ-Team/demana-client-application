export type PrinterType = 'usb' | 'serial'

export class Printer {
    constructor(private device: USBDevice | SerialPort, private type: PrinterType) {}

    async printText(text): Promise<void> {
        try {
            if (this.type === 'usb') {
                await this.printUsbText(text)
            }  else if (this.type === 'serial') {
                await this.printSerialText(text)
            } else {
                throw new Error('this printer is not supported')
            }
        } catch (exception) {
            throw new Error(`Failed to print text: ${exception}`, { cause: exception })
        }
    }

    async printUsbText(text): Promise<void> {
        try {
            const printerDevice = this.device as USBDevice
            // const textBytes = new Uint8Array(stringToBytes(text))
            // const textBuffer = Buffer.from(text, 'utf8')

            console.log({ text })
            const {
                printerConfiguration,
                printerInterface,
                printerEndpoint: { endpointNumber }
            } = this.getUsbPrintSessionProperties('out')

            await printerDevice.open()
            await printerDevice.selectConfiguration(printerConfiguration.configurationValue)
            await printerDevice.claimInterface(printerInterface.interfaceNumber)

            // const script = new EscPosScript().printText('Demana').complete()

            // console.log({ script, textBytes })

            // let test = new Uint8Array(10 + new TextEncoder().encode("Demana").length)

            // test.set([0x1B, 0x40, 0x1B, 0x64, 1, 0x54, 0x65, 0x73, 0x74, ...new TextEncoder().encode("Demana")])

            // const test = Buffer.from([0x1B, 0x40, 0x1B, 0x64, 1, 0x54, 0x65, 0x73, 0x74, ...new TextEncoder().encode("Demana")])
            // 1B 40 1B 64 5 Demana
            // 0, 0x31, 0, 0x61

            // await this.device.transferOut(endpointNumber, script)

            // await this.device.controlTransferIn({
            //     requestType: 'class',
            //     recipient: 'device',
            //     index: printerInterface.interfaceNumber,
            //     request: 0,
            //     value: 0
            // }, textBytes.length)

            await printerDevice.transferOut(endpointNumber, text)

            await printerDevice.releaseInterface(printerInterface.interfaceNumber)

            await printerDevice.close()
        } catch (exception) {
            throw new Error(`Failed to print text: ${exception}`, { cause: exception })
        }
    }

    async printSerialText(text): Promise<void> {
        try {
            const printerdevice = this.device as SerialPort

            await printerdevice.open({ baudRate: 9600 })

            const writer = printerdevice.writable.getWriter()
            await writer.write(text)

            writer.releaseLock()

            await printerdevice.close()
        } catch (exception) {
            throw new Error(`Failed to print text: ${exception}`, { cause: exception })
        }
    }

    private getUsbPrinterConfiguration(direction: 'in' | 'out'): USBConfiguration | undefined {
        const printerDevice = this.device as USBDevice

        return printerDevice.configurations.find(
            ({ interfaces }) =>
                !!interfaces.find(
                    ({ alternate }) =>
                        !!alternate.endpoints.find((altEndpoint) => altEndpoint.direction === direction)
                )
        )
    }

    private getPrinterInterface(
        printerConfiguration: USBConfiguration,
        direction: 'in' | 'out'
    ): USBInterface | undefined {
        return printerConfiguration.interfaces.find(
            ({ alternate }) =>
                !!alternate.endpoints.find((altEndpoint) => altEndpoint.direction === direction)
        )
    }

    private getPrinterEndpoint(
        printerInterface: USBInterface,
        direction: 'in' | 'out'
    ): USBEndpoint | undefined {
        return printerInterface.alternate.endpoints.find(
            (altEndpoint) => altEndpoint.direction === direction
        )
    }

    private getUsbPrintSessionProperties(direction: 'in' | 'out'): {
    printerConfiguration: USBConfiguration;
    printerInterface: USBInterface;
    printerEndpoint: USBEndpoint;
  } {
        try {
            const selectedConfiguration = this.getUsbPrinterConfiguration(direction)

            if (!selectedConfiguration) {
                throw new Error('no suitable configuration found')
            }

            const selectedInterface = this.getPrinterInterface(selectedConfiguration, direction)

            if (!selectedInterface) {
                throw new Error('no suitable interface found')
            }

            const selectedEndpoint = this.getPrinterEndpoint(selectedInterface, direction)

            if (!selectedEndpoint) {
                throw new Error('no suitable endpoint found')
            }

            return {
                printerConfiguration: selectedConfiguration,
                printerInterface: selectedInterface,
                printerEndpoint: selectedEndpoint
            }
        } catch (exception) {
            throw new Error(
                `Failed to get a printer endpoint with options { direction: ${direction}}: `,
                { cause: exception }
            )
        }
    }
}
