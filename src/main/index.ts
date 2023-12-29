import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'

import icon from '../../resources/icon.png?asset'

import StorageService from './services/storageService'
import SessionService from './services/sessionService'
import PrinterService from './services/printerService'

let mainWindow: BrowserWindow

const userDataStore = new StorageService('userData', 'configuration.json')

let sessionService: SessionService
let printerService: PrinterService

function createWindow(): BrowserWindow {
  // Create the browser window.
  const window = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: !is.dev,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      devTools: is.dev
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
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    window.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    window.loadFile(join(__dirname, '../renderer/index.html'))
  }

  if (is.dev) {
    window.webContents.openDevTools()
  }

  return window
}

function getOrCreateMainWindow(): BrowserWindow {
  return !mainWindow ? createWindow() : mainWindow
}

function initializeIpcHandlers(): void {
  ipcMain.on('setSelectedPrinter', (_event, printerId: string) => {
    printerService.selectedPrinterId = printerId
  })
}

function initializeServices(): void {
  const { id } = getOrCreateMainWindow()

  sessionService = new SessionService(id)
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

  if (is.dev) {
    try {
      await installExtension(VUEJS_DEVTOOLS)
      console.log('Vue devtools are installed!')
    } catch (exception) {
      console.error('Failed to install Vue devtools', exception)
    }
  }
  // replace param with the ext ID of your choice
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
