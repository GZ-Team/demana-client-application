import type { BrowserWindowConstructorOptions, NativeImage } from 'electron'
import { BrowserWindow, shell } from 'electron'
import { join } from 'path'
import type { DemanaProcessType } from '@root/types'
import type { DemanaService } from '../types'

export enum DemanaPreloadScriptPath {
  WORKER = '../preload/worker.js',
  UI = '../preload/ui.js',
  DEFAULT = '../preload/default.js'
}

type DemanaWindowOptions = {
  title: string;
  icon?: NativeImage;
  content: string;
  preload: DemanaPreloadScriptPath;
};

type DemanaProcessMode = 'development' | 'production';

type DemanaProcessEventName = 'close';

type DemanaProcessOptions = {
  window: DemanaWindowOptions;
  mode?: DemanaProcessMode;
  events?: Record<DemanaProcessEventName, () => void>;
};

export default class ProcessService implements DemanaService {
    private get commonProcessProperties(): BrowserWindowConstructorOptions {
        return {
            show: false,
            webPreferences: {
                sandbox: false,
                contextIsolation: true
            }
        }
    }

    private createUiProcess(options: DemanaProcessOptions): BrowserWindow {
        try {
            const { mode, window, events } = options

            const isDev = mode === 'development'

            // Create the browser window.
            const uiProcess = new BrowserWindow({
                ...this.commonProcessProperties,
                width: 900,
                height: 670,
                autoHideMenuBar: !isDev,
                title: window.title,
                icon: window.icon,
                webPreferences: {
                    ...this.commonProcessProperties.webPreferences,
                    preload: join(__dirname, window.preload),
                    devTools: true
                }
            })

            uiProcess.on('ready-to-show', () => {
                uiProcess.show()
            })

            if (events) {
                Object.entries(events)
                    .filter(([, eventCallback]) => eventCallback)
                    .forEach(([eventName, eventCallback]) => {
                        switch (eventName) {
                        case 'close':
                            uiProcess.on('close', eventCallback)

                            break
                        }
                    })
            }

            uiProcess.webContents.setWindowOpenHandler((details) => {
                shell.openExternal(details.url)
                return { action: 'deny' }
            })

            // HMR for renderer base on electron-vite cli.
            // Load the remote URL for development or the local html file for production.
            if (isDev && process.env['ELECTRON_RENDERER_URL']) {
                uiProcess.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/ui/index.html`)
            } else {
                uiProcess.loadFile(window.content)
            }

            if (true) {
                uiProcess.webContents.openDevTools()
            } else {
                // Menu.setApplicationMenu(null)
            }

            return uiProcess
        } catch (exception) {
            throw new Error(`Failed to create a Demana UI process: ${(exception as Error).message}`, {
                cause: exception
            })
        }
    }

    private createWorkerProcess(options: DemanaProcessOptions): BrowserWindow {
        try {
            const { mode, window } = options

            const isDev = mode === 'development'

            const workerProcess = new BrowserWindow({
                ...this.commonProcessProperties,
                width: isDev ? 900 : undefined,
                height: isDev ? 670 : undefined,
                icon: window.icon,
                webPreferences: {
                    ...this.commonProcessProperties.webPreferences,
                    preload: join(__dirname, window.preload),
                    devTools: isDev
                }
            })

            workerProcess.excludedFromShownWindowsMenu = !isDev

            // HMR for renderer base on electron-vite cli.
            // Load the remote URL for development or the local html file for production.
            if (isDev && process.env['ELECTRON_RENDERER_URL']) {
                workerProcess.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/worker/index.html`)
            } else {
                workerProcess.loadFile(window.content)
            }

            if (isDev) {
                workerProcess.on('ready-to-show', () => {
                    workerProcess.setTitle(window.title || 'worker-process')
                    workerProcess.show()
                })

                workerProcess.webContents.openDevTools()
            }

            return workerProcess
        } catch (exception) {
            throw new Error(`Failed to create a Demana worker process: ${(exception as Error).message}`, {
                cause: exception
            })
        }
    }

    createProcess(name: DemanaProcessType, options: DemanaProcessOptions): BrowserWindow {
        try {
            switch (name) {
            case 'ui':
                return this.createUiProcess(options)
            case 'worker':
                return this.createWorkerProcess(options)
            default:
                throw new Error(`'${name}' is not a known Demana process name.`)
            }
        } catch (exception) {
            throw new Error(`Failed to create a Demana process: ${(exception as Error).message}`, {
                cause: exception
            })
        }
    }
}
