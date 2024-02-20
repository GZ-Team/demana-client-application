import { app, BrowserWindow, ipcMain, nativeImage } from 'electron'
import { join, resolve } from 'path'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'

import handleUpdates from './updater'

import AppDataService from './services/appDataService'
import ContextService from './services/contextService'
import RuntimeConfigService from './services/runtimeConfigService'
import PreferencesService from './services/preferencesService'
import TemporaryDataService from './services/temporaryDataService'
import SessionService from './services/sessionService'
import PrinterService from './services/printerService'
import TrayService from './services/trayService'
import TranslationService from './services/translationService'
import NotificationService from './services/notificationService'
import ProcessService, { DemanaPreloadScriptPath } from './services/processService'
import TicketService from './services/ticketService'

import RabbitAmqpClient from './clients/rabbitAmqpClient'

import { pushEventToProcess } from './utils/eventUtils'
import { parseLocale } from './utils/i18nUtils'
import useLogger from './utils/loggerUtils'
import { openExternalLink } from './utils/externalUtils'

import type {
    DemanaLocaleCode,
    DemanaLocaleTranslation,
    DemanaMessage,
    DemanaPreferences,
    DemanaPrintingConfiguration,
    DemanaTemporaryDataDto,
    Optional
} from '../types'

import demanaLogo from '../../resources/demana.png'

const { logger } = useLogger()

let isApplicationBeingClosed = false
const demanaDesktopProtocol = 'demana-desktop'
const icon = nativeImage.createFromDataURL(demanaLogo)

const context: ContextService = ContextService.instance

let mainWorkerProcess: BrowserWindow
let mainUiProcess: BrowserWindow

function getOrCreateMainUiProcess(): BrowserWindow {
    const processService = context.getServiceByName<ProcessService>('process')
    const runtimeConfigService = context.getServiceByName<RuntimeConfigService>('runtimeConfig')
    const notificationService = context.getServiceByName<NotificationService>('notification')
    const translationService = context.getServiceByName<TranslationService>('translation')

    if (!mainUiProcess || mainUiProcess.isDestroyed()) {
        mainUiProcess = context.registerProcess('ui', processService.createProcess('ui', {
            window: {
                title: 'Main UI',
                icon,
                content: join(__dirname, '../renderer/ui/index.html'),
                preload: DemanaPreloadScriptPath.UI
            },
            mode: runtimeConfigService.isDev ? 'development' : 'production',
            events: {
                close: () => {
                    if (!isApplicationBeingClosed) {
                        notificationService.showNotification({
                            title: translationService.translate('notifications.runningInBackground.title'),
                            message: translationService.translate('notifications.runningInBackground.message'),
                            icon
                        })
                    }
                }
            }
        }))
    }

    return mainUiProcess
}

function initializeIpcHandlers(): void {
    // APP DATA
    ipcMain.handle('getAppId', (): string => {
        return context.getServiceByName<AppDataService>('app').appId
    })

    ipcMain.on('setAppId', (_event, appId: string): void => {
        context.getServiceByName<AppDataService>('app').appId = appId
    })

    ipcMain.on('setVenueId', (_event, venueId: string): void => {
        context.getServiceByName<SessionService>('session').venueId = venueId
    })

    // MESSAGES
    ipcMain.on('sendMessage', (_event, message: DemanaMessage): void => {
        try {
            switch (message.target) {
            case 'ui':
                return pushEventToProcess<DemanaMessage>(
                    { name: '@messages:new', value: message },
                    mainUiProcess
                )
            case 'worker':
                return pushEventToProcess<DemanaMessage>(
                    { name: '@messages:new', value: message },
                    mainWorkerProcess
                )
            }
        } catch (exception) {
            throw new Error(`Failed to process a received message for target '${message.target}': ${(exception as Error).message}`)
        }
    })

    // PRINTING
    ipcMain.handle('getSelectedPrinter', (): string => {
        return context.getServiceByName<PrinterService>('printer').selectedPrinterId
    })

    ipcMain.on('setSelectedPrinter', (_event, printerId: string): void => {
        context.getServiceByName<PrinterService>('printer').selectedPrinterId = printerId
    })

    ipcMain.handle('getPrintingConfiguration', (): DemanaPrintingConfiguration => {
        return context.getServiceByName<PrinterService>('printer').printingConfiguration
    })

    ipcMain.on(
        'setPrintingConfiguration',
        (_event, printingConfiguration: string): void => {
            console.log({printingConfiguration})
            context.getServiceByName<PrinterService>('printer').printingConfiguration =
                JSON.parse(printingConfiguration)
        }
    )

    // PREFERENCES
    ipcMain.on(
        'setPreferences',
        (_event, preferencesUpdate: Optional<DemanaPreferences, 'language'>) => {
            context.getServiceByName<PreferencesService>('preferences').preferences = preferencesUpdate
        }
    )

    ipcMain.handle('getPreferences', (): DemanaPreferences => {
        return context.getServiceByName<PreferencesService>('preferences').preferences
    })

    // TEMPORARY DATA
    ipcMain.handle(
        'getTemporaryData',
        (): Optional<DemanaTemporaryDataDto, 'redirectionRoute'> => {
            const { currentRouteName } =
                context.getServiceByName<TemporaryDataService>('temporaryData').data

            return {
                redirectionRoute: currentRouteName
            }
        }
    )

    ipcMain.on(
        'setTemporaryData',
        (_event, { key, value }: { key: keyof DemanaTemporaryDataDto; value: string | null }): void => {
            switch (key) {
            case 'redirectionRoute':
                context.getServiceByName<TemporaryDataService>('temporaryData').currentRouteName = value
                break
            }
        }
    )

    // I18N
    ipcMain.handle('getAvailableLocaleCodes', (): DemanaLocaleCode[] => {
        return context.getServiceByName<TranslationService>('translation').availableLocaleCodes
    })

    ipcMain.handle(
        'getAllTranslations',
        (): Record<DemanaLocaleCode, DemanaLocaleTranslation> => {
            return context.getServiceByName<TranslationService>('translation').allTranslations
        }
    )

    // APP BEHAVIOUR
    ipcMain.on('openExternalLink', async (_event, link: string): Promise<void> => {
        logger.info(`Opening an external link: ${link}`)
        await openExternalLink(link)
    })

    // LOGGING
    ipcMain.on(
        'log',
        (
            _event,
            {
                message,
                meta,
                level,
                service
            }: { message: string; meta: unknown[]; level: string; service: string }
        ): void => {
            useLogger({ service, isMainProcess: false }).logger.log(level, message, meta)
        }
    )

    // AUTHENTICATION
    ipcMain.handle('refresh', async (): Promise<void> => {
        await context.getServiceByName<SessionService>('session').refreshAuthenticationSession()
    })

    ipcMain.handle('logout', async (): Promise<void> => {
        await context.getServiceByName<SessionService>('session').endAuthenticatedSession()
    })
}

function initializeServices(): void {
    context
        .registerService('preferences', new PreferencesService())
        .setDefaultValues({ language: parseLocale(app.getLocale()) })

    context.registerService('temporaryData', new TemporaryDataService()).setDefaultValues()

    context.registerService('printer', new PrinterService()).setDefaultValues()

    context.registerServices({
        app: new AppDataService(),
        session: new SessionService(mainUiProcess.id, mainWorkerProcess.id)
    })

    const translationService = context.getServiceByName<TranslationService>('translation')

    context
        .registerService(
            'tray',
            new TrayService({
                icon,
                contextMenuContent: [
                    {
                        label: translationService.translate('globals.applicationName'),
                        enabled: false
                    },
                    {
                        type: 'separator'
                    },
                    {
                        label: translationService.translate('tray.links.preferences'),
                        click: () => showMainUiProcess('Preferences'),
                        type: 'normal'
                    },
                    {
                        type: 'separator'
                    },
                    {
                        label: translationService.translate('tray.actions.open'),
                        type: 'normal',
                        click: () => showMainUiProcess()
                    },
                    {
                        label: translationService.translate('tray.actions.exit'),
                        type: 'normal',
                        click: () => beforeApplicationExit(),
                        role: 'quit'
                    }
                ]
            })
        )
        .buildTrayContextMenu()
        .on('click', () => showMainUiProcess())

    context.registerService('ticket', new TicketService())
}

async function initializeClients(): Promise<void> {
    const {
        VITE_RABBITMQ_HOST,
        VITE_RABBITMQ_PORT,
        VITE_RABBITMQ_USERNAME,
        VITE_RABBITMQ_PASSWORD
    } = context.getServiceByName<RuntimeConfigService>('runtimeConfig').runtimeConfig

    const amqpClient = context.registerClient('amqp', new RabbitAmqpClient())
    await amqpClient.connect({
        connection: {
            host: VITE_RABBITMQ_HOST,
            port: VITE_RABBITMQ_PORT,
            username: VITE_RABBITMQ_USERNAME,
            password: VITE_RABBITMQ_PASSWORD
        }
    })
}

function showMainUiProcess(routeName?: string): void {
    const mainUiProcess = getOrCreateMainUiProcess()

    context.getServiceByName<SessionService>('session').uiProcess = mainUiProcess

    if (routeName) {
        context.getServiceByName<TemporaryDataService>('temporaryData').currentRouteName = routeName
    }

    if (!mainUiProcess.isVisible()) {
        mainUiProcess.show()
    } else if (mainUiProcess.isVisible() && routeName) {
        pushEventToProcess({ name: '@window:external-navigation', value: routeName }, mainUiProcess)
    }

    if (!mainUiProcess.isFocused()) {
        mainUiProcess.focus()
    }
}

async function beforeApplicationExit(): Promise<void> {
    isApplicationBeingClosed = true

    const rabbitAmpqClientExists =  context.hasClientByName('amqp')

    if (rabbitAmpqClientExists) {
        await context.getClientByName<RabbitAmqpClient>('amqp').closeAllQueueChannels()
    }
}

async function startApplication(): Promise<void> {
    const processService = context.registerService('process', new ProcessService())
    const runtimeConfigService = context.registerService('runtimeConfig', new RuntimeConfigService())
    const translationService = context.registerService('translation', new TranslationService())
    context.registerService('notification', new NotificationService(icon))

    // Set app user model id for windows
    electronApp.setAppUserModelId('digital.demana')

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window)
    })

    initializeIpcHandlers()

    mainWorkerProcess = context.registerProcess('worker', processService.createProcess('worker', {
        mode: runtimeConfigService.isDev ? 'development' : 'production',
        window: {
            title: 'Main worker',
            content: join(__dirname, '../renderer/worker/index.html'),
            icon,
            preload: DemanaPreloadScriptPath.WORKER
        }
    }))

    mainWorkerProcess.on('close', (event) => {
        if (!isApplicationBeingClosed) {
            event.preventDefault()
        }
    })

    mainUiProcess = getOrCreateMainUiProcess()

    initializeServices()
    await initializeClients()

    await context.getServiceByName<TicketService>('ticket').startListeningForNewTickets()

    mainUiProcess.setTitle(translationService.translate('globals.applicationName'))

    if (runtimeConfigService.isDev) {
        try {
            await installExtension(VUEJS_DEVTOOLS)
            logger.debug('Vue devtools are installed!')
        } catch (exception) {
            logger.debug('Failed to install Vue devtools', exception)
        }
    }

    app.on('activate', function() {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) {
            getOrCreateMainUiProcess()
        }
    })
}

process.on('uncaughtException', (error) => {
    logger.error(`An uncaught exception occured: ${error.message}`)
})

if (process.defaultApp) {
    if (process.argv.length >= 2) {
        app.setAsDefaultProtocolClient(demanaDesktopProtocol, process.execPath, [resolve(process.argv[1])])
    }
} else {
    app.setAsDefaultProtocolClient(demanaDesktopProtocol)
}

handleUpdates(app)

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
    app.quit()
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        const mainUiProcessExists = context.hasProcessByName('ui')

        if (mainUiProcessExists) {
            const mainUiProcess = context.getProcessByName('ui')

            if (mainUiProcess.isMinimized()) {
                mainUiProcess.restore()
            }

            mainUiProcess.focus()
        }
    })

    app.whenReady().then(async () => await startApplication())
}

/**
 * This method will be called when Electron has finished
 * initialization and is ready to create browser windows.
 * Some APIs can only be used after this event occurs.
 */
// app.whenReady().then(async () => await startApplication())

/**
 * Hides the main window, except on macOS.
 * There, it's common for applications and their menu bar to stay active
 * until the user quits explicitly with Cmd + Q.
 */
app.on('window-all-closed', async () => {
    if (isApplicationBeingClosed) {
        app.quit()
    }
})

/**
 * Actions done before ending the application.
 */
app.on('before-quit', async () => {
    await beforeApplicationExit()
})

app.on('open-url', (event, url) => {
    const mainUiProcessExists = context.hasProcessByName('ui')

    if (mainUiProcessExists) {
        const mainUiProcess = context.getProcessByName('ui')

        if (mainUiProcess.isMinimized()) {
            mainUiProcess.restore()
        }

        mainUiProcess.focus()
    }
})
