import { app, BrowserWindow, ipcMain, nativeImage } from 'electron'
import { join } from 'path'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'

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
        mainUiProcess = processService.createProcess('ui', {
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
        })
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
        (_event, printingConfiguration: DemanaPrintingConfiguration): void => {
            context.getServiceByName<PrinterService>('printer').printingConfiguration =
        printingConfiguration
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

function beforeApplicationExit(): void {
    isApplicationBeingClosed = true
}

/**
 * This method will be called when Electron has finished
 * initialization and is ready to create browser windows.
 * Some APIs can only be used after this event occurs.
 */
app.whenReady().then(async () => {
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

    mainWorkerProcess = processService.createProcess('worker', {
        mode: runtimeConfigService.isDev ? 'development' : 'production',
        window: {
            title: 'Main worker',
            content: join(__dirname, '../renderer/worker/index.html'),
            icon,
            preload: DemanaPreloadScriptPath.WORKER
        }
    })

    mainWorkerProcess.on('close', (event) => {
        if (!isApplicationBeingClosed) {
            event.preventDefault()
        }
    })

    mainUiProcess = getOrCreateMainUiProcess()

    initializeServices()

    initializeIpcHandlers()

    mainUiProcess.setTitle(translationService.translate('globals.applicationName'))

    // setInterval(
    //   () => pushEventToProcess({ name: '@orders:new', value: 'test' }, mainWorkerProcess),
    //   10 * 1000
    // );

    if (runtimeConfigService.isDev) {
        try {
            await installExtension(VUEJS_DEVTOOLS)
            logger.debug('Vue devtools are installed!')
        } catch (exception) {
            console.error('Failed to install Vue devtools', exception)
        }
    }

    app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) {
            getOrCreateMainUiProcess()
        }
    })
})

/**
 * Hides the main window, except on macOS.
 * There, it's common for applications and their menu bar to stay active
 * until the user quits explicitly with Cmd + Q.
 */
app.on('window-all-closed', () => {
    if (isApplicationBeingClosed) {
        app.quit()
    }
})

/**
 * Actions done before ending the application.
 */
app.on('before-quit', () => {
    beforeApplicationExit()
})
