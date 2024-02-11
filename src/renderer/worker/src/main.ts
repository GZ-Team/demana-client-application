import PrinterService from './services/printerService'

import useLogger from './utils/loggingUtils'

const printerService = new PrinterService()

const logger = useLogger({ service: 'Main' })

window.api['@orders:new'](async () => {
    await printerService.print()
})

window.api['@messages:new'](async (message) => {
    if (message.target === 'worker' && message.content === 'test-printer') {
        await printerService.print()
    }
})

window.api['@session:authenticated'](async (authenticated) => {
    logger.info(`New session authenticated status: ${authenticated}`)
})
