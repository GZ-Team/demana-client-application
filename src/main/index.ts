import { app, shell, BrowserWindow, ipcMain, Menu } from 'electron'
import { join } from 'path'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'

import { isDev } from './utils/configUtils'

import StorageService from './services/storageService'
import SessionService from './services/sessionService'
import PrinterService from './services/printerService'

import icon from '../../resources/demana.png'

let mainWindow: BrowserWindow

const userDataStore = new StorageService('userData', 'configuration.json')

let printerService: PrinterService

function createWindow(): BrowserWindow {
  // Create the browser window.
  const window = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: !isDev(),
    icon,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      devTools: isDev(),
      contextIsolation: true
    }
  })

  window.on('ready-to-show', () => {
    mainWindow.show()
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
  return mainWindow || createWindow()
}

function initializeIpcHandlers(): void {
  ipcMain.on('setSelectedPrinter', (_event, printerId: string) => {
    printerService.selectedPrinterId = printerId
  })
}

function initializeServices(): void {
  const { id } = getOrCreateMainWindow()

  new SessionService(id)
  printerService = new PrinterService(userDataStore)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
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

  initializeIpcHandlers()
  initializeServices()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) getOrCreateMainWindow()
  })

  if (isDev()) {
    try {
      await installExtension(VUEJS_DEVTOOLS)
      console.log('Vue devtools are installed!')
    } catch (exception) {
      console.error('Failed to install Vue devtools', exception)
    }
  }
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
