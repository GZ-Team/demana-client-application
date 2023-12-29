import { EscPosScript } from '@gz-team/esc-pos'

import { stringToBytes } from "../utils/printerUtils";

export class Printer {

    constructor(private device: USBDevice) { }

    async printText(text: string): Promise<USBOutTransferResult> {
        try {
            const textBytes = new Uint8Array(stringToBytes(text))
            const { printerConfiguration, printerInterface, printerEndpoint: { endpointNumber } } = this.getPrintSessionProperties('out')

            await this.device.open()
            await this.device.selectConfiguration(printerConfiguration.configurationValue)
            await this.device.claimInterface(printerInterface.interfaceNumber)

            const script = new EscPosScript().printText("Demana").complete()

            console.log(script)

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

            const result = await this.device.transferOut(endpointNumber, script)

            await this.device.releaseInterface(printerInterface.interfaceNumber)

            await this.device.close()

            return result
        } catch (exception) {
            throw new Error(`Failed to print text: ${exception}`, { cause: exception })
        }
    }

    private getPrinterConfiguration(direction: 'in' | 'out'): USBConfiguration | undefined {
        return this.device.configurations.find(({ interfaces }) =>
            !!interfaces.find(({ alternate }) => !!alternate.endpoints.find(altEndpoint => altEndpoint.direction === direction))
        )
    }

    private getPrinterInterface(printerConfiguration: USBConfiguration, direction: 'in' | 'out'): USBInterface | undefined {
        return printerConfiguration.interfaces.find(({ alternate }) =>
            !!alternate.endpoints.find(altEndpoint => altEndpoint.direction === direction)
        )
    }

    private getPrinterEndpoint(printerInterface: USBInterface, direction: 'in' | 'out'): USBEndpoint | undefined {
        return printerInterface.alternate.endpoints.find(altEndpoint => altEndpoint.direction === direction)
    }

    private getPrintSessionProperties(direction: 'in' | 'out'): { printerConfiguration: USBConfiguration, printerInterface: USBInterface, printerEndpoint: USBEndpoint } {
        try {
            const selectedConfiguration = this.getPrinterConfiguration(direction)

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

            return { printerConfiguration: selectedConfiguration, printerInterface: selectedInterface, printerEndpoint: selectedEndpoint }
        } catch (exception) {
            throw new Error(`Failed to get a printer endpoint with options { direction: ${direction}}: `, { cause: exception })
        }
    }
}