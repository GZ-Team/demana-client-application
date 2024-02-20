import PrinterService from './services/printerService'

const printerService = new PrinterService()

console.log({printer: await printerService.getSelectedPrinter()})

window.api['@orders:new'](async (message) => {
    await printerService.print(message as string)
})
