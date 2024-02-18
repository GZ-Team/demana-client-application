import PrinterService from './services/printerService'

import useLogger from './utils/loggingUtils'

const printerService = new PrinterService()

const logger = useLogger({ service: 'Main' })

console.log({printer: await printerService.getSelectedPrinter()})

window.api['@orders:new'](async (message) => {
    await printerService.print(message as string)
})

window.api['@session:authenticated'](async (authenticated) => {
    logger.info(`New session authenticated status: ${authenticated}`)
})
