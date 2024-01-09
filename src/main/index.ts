import { app, shell, BrowserWindow, ipcMain, Menu, Notification, nativeImage, NativeImage } from 'electron'
import { join } from 'path'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'

import { isDev } from './utils/configUtils'

import StorageService from './services/storageService'
import SessionService from './services/sessionService'
import PrinterService from './services/printerService'
import TrayService from './services/trayService'
import TranslationService from './services/translationService'

import demanaLogo from '../../resources/demana.png'

type DemanaWindowOptions = {
  title?: string,
  icon: NativeImage
}

let mainWindow: BrowserWindow

let isApplicationBeingClosed = false

const userDataStore = new StorageService('userData', 'configuration.json')

let translationService: TranslationService
let printerService: PrinterService

const icon = nativeImage.createFromDataURL(demanaLogo)

function createWindow(options: DemanaWindowOptions): BrowserWindow {
  // Create the browser window.
  const window = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: !isDev(),
    title: options.title,
    icon: options.icon,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      devTools: isDev(),
      contextIsolation: true
    }
  })

  window.on('ready-to-show', () => {
    window.show()
  })

  window.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (isDev() && process.env['ELECTRON_RENDERER_URL']) {
    window.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    window.loadFile(join(__dirname, '../renderer/index.html'))
  }

  if (isDev()) {
    window.webContents.openDevTools()
  } else {
    Menu.setApplicationMenu(null)
  }

  return window
}

function getOrCreateMainWindow(): BrowserWindow {
  if (!mainWindow || mainWindow.isDestroyed()) {
    mainWindow = createWindow({ icon })
  }

  return mainWindow
}

function initializeIpcHandlers(): void {
  ipcMain.on('setSelectedPrinter', (_event, printerId: string) => {
    printerService.selectedPrinterId = printerId
  })

  ipcMain.handle('getAvailableLocaleCodes', (_event) => {
    return translationService.availableLocaleCodes
  })

  ipcMain.handle('getLocaleTranslations', (_event) => {
    return translationService.translations
  })
}

function initializeServices(): void {
  const { id } = getOrCreateMainWindow()

  new SessionService(id)

  translationService = new TranslationService(app.getLocale())

  const { translate } = translationService

  new TrayService({
    icon,
    contextMenuContent: [
      {
        label: translate("globals.applicationName"), enabled: false
      },
      {
        type: 'separator'
      },
      {
        label: translate("tray.actions.open"), type: 'normal', click: () => showMainWindow(), role: 'reload'
      },
      {
        label: translate("tray.actions.exit"), type: 'normal', click: () => beforeApplicationExit(), role: 'quit'
      }
    ]
  })
    .buildTrayContextMenu()
    .on('click', () => showMainWindow())

  printerService = new PrinterService(userDataStore)
}

function showMainWindow(): void {
  const mainWindow = getOrCreateMainWindow()

  if (!mainWindow.isVisible()) {
    mainWindow.show()
  }

  if (!mainWindow.isFocused()) {
    mainWindow.focus()
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
  // Set app user model id for windows
  electronApp.setAppUserModelId('digital.demana')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  mainWindow = getOrCreateMainWindow()

  mainWindow.on("close", () => {
    if (!isApplicationBeingClosed) {
      const { translate } = translationService

      new Notification({
        title: translate('notifications.runningInbackground.title'),
        body: translate('notifications.runningInbackground.message'),
        icon
      }).show()
    }
  })

  initializeIpcHandlers()
  initializeServices()

  mainWindow.setTitle(translationService.translate("globals.applicationName"))

  if (isDev()) {
    try {
      await installExtension(VUEJS_DEVTOOLS)
      console.log('Vue devtools are installed!')
    } catch (exception) {
      console.error('Failed to install Vue devtools', exception)
    }
  }

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      getOrCreateMainWindow()
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
