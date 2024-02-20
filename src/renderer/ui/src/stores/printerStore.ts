import { defineStore } from 'pinia'

import useGraphQl from '@ui/composables/useGraphQl'

import type { DemanaPrintingConfiguration } from '@root/types'
import type { DemanaApiRequestFeedback } from '@ui/utils/graphQlUtils'
import type { AuthenticationFeedback, PrinterConfigurationForm } from '@generated/graphql'

type StoreState = {
  usbPrinters: Array<USBDevice>;
  serialPrinters: Array<SerialPort>;
  selectedPrinterId: string | number | null;
  printingConfiguration: DemanaPrintingConfiguration | null;
};

export const usePrinterStore = defineStore('printerStore', {
    state: (): StoreState => ({
        usbPrinters: [],
        serialPrinters: [],
        selectedPrinterId: null,
        printingConfiguration: null
    }),

    getters: {
        selectedPrinter: ({usbPrinters, selectedPrinterId}) => selectedPrinterId ? usbPrinters.find(({productId}) => productId === parseInt(`${selectedPrinterId}`)) : null
    },

    actions: {
        async loadAllUsbPrinters(): Promise<void> {
            try {
                this.usbPrinters = (await navigator.usb.getDevices())
                    .filter(
                        ({ productName, configuration }) =>
                            !!productName &&
              !!configuration &&
              Object.values(configuration.interfaces).some(({ alternate }) =>
                  alternate.endpoints.some(
                      ({ direction, type }) =>
                      // TODO: CHECK DIRECTION AND TYPE DOCUMENTATION
                          ['in', 'out'].includes(direction) && type === 'bulk'
                  )
              )
                    )
                    .sort((printerA, printerB) =>
                        printerA.productName &&
            printerB.productName &&
            printerA.productName > printerB.productName
                            ? 1
                            : printerA.productName &&
                printerB.productName &&
                printerB.productName > printerA.productName
                                ? -1
                                : 0
                    )
            } catch (exception) {
                throw new Error(`Failed to load all USB printers: ${(exception as Error).message}`, {
                    cause: exception
                })
            }
        },
        async loadAllSerialPrinters(): Promise<void> {
            try {
                this.serialPrinters = await navigator.serial.getPorts()
            } catch (exception) {
                throw new Error(
                    `Failed to load all serial printers printers: ${(exception as Error).message}`,
                    { cause: exception }
                )
            }
        },
        async loadAllPrinters(): Promise<void> {
            try {
                await Promise.all([this.loadAllUsbPrinters(), this.loadAllSerialPrinters()])
            } catch (exception) {
                throw new Error(`Failed to load all printers: ${(exception as Error).message}`, {
                    cause: exception
                })
            }
        },
        async loadSelectedPrinterId(): Promise<string | number | null> {
            try {
                this.selectedPrinterId = await window.api.getSelectedPrinter()
                return this.selectedPrinterId
            } catch (exception) {
                throw new Error(`Failed to load the selected printer ID: ${(exception as Error).message}`, {
                    cause: exception
                })
            }
        },
        async updateSelectedPrinterId(
            newSelectedPrinterId: string | number | null
        ): Promise<string | number | null> {
            try {
                window.api.setSelectedPrinter(newSelectedPrinterId)
                return this.loadSelectedPrinterId()
            } catch (exception) {
                throw new Error(
                    `Failed to update the selected printer ID: ${(exception as Error).message}`,
                    { cause: exception }
                )
            }
        },
        async loadPrintingConfiguration(): Promise<DemanaPrintingConfiguration> {
            try {
                this.printingConfiguration = await window.api.getPrintingConfiguration()
                return this.printingConfiguration
            } catch (exception) {
                throw new Error(
                    `Failed to load the printing configuration: ${(exception as Error).message}`,
                    { cause: exception }
                )
            }
        },
        async savePrinterConfigurationToBackoffice(printerConfigurationForm: PrinterConfigurationForm) {
            try {
                return await useGraphQl().mutate<AuthenticationFeedback>({
                    mutation: 'desktop-application.savePrinterConfiguration',
                    variables: { printerConfigurationForm },
                    key: 'savePrinterConfiguration',
                    successMessage: 'success.printer-configuration.save-success'
                })
            } catch (exception) {
                throw new Error(`Failed to save the printer configuration to the backoffice: ${(exception as Error).message}`, { cause: exception })
            }
        },
        async updatePrintingConfiguration(
            newPrintingConfiguration: DemanaPrintingConfiguration
        ): Promise<DemanaPrintingConfiguration> {
            try {
                window.api.setPrintingConfiguration(JSON.stringify(newPrintingConfiguration))
                await this.savePrinterConfigurationToBackoffice(newPrintingConfiguration as PrinterConfigurationForm)
                return this.loadPrintingConfiguration()
            } catch (exception) {
                throw new Error(
                    `Failed to update the printing configuration: ${(exception as Error).message}`,
                    { cause: exception }
                )
            }
        },
        async testPrintingConfiguration(): Promise<DemanaApiRequestFeedback<boolean>> {
            try {
                return await useGraphQl().mutate<boolean>({
                    mutation: 'desktop-application.printTestTicket',
                    key: 'printTestTicket'
                })
            } catch (exception) {
                throw new Error(
                    `Failed to test the printing configuration: ${(exception as Error).message}`,
                    { cause: exception }
                )
            }
        }
    }
})
