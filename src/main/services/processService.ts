import { BrowserWindow, shell } from 'electron';
import { join } from 'path';

import { pushEventToProcess } from '../utils/eventUtils';

import type { NativeImage, BrowserWindowConstructorOptions } from 'electron'
import type { DemanaProcessType, DemanaWindowState } from 'types';

export enum DemanaPreloadScriptPath {
  WORKER = '../preload/worker.js',
  UI = '../preload/ui.js',
  DEFAULT = '../preload/default.js'
}

type DemanaWindowOptions = {
  title?: string;
  icon?: NativeImage;
  content: string;
  preload: DemanaPreloadScriptPath;
};

type DemanaProcessMode = 'development' | 'production';

type DemanaProcessOptions = {
  window: DemanaWindowOptions;
  mode?: DemanaProcessMode;
};

export default class {
  private get commonProcessProperties(): BrowserWindowConstructorOptions {
    return {
      show: false,
      webPreferences: {
        sandbox: false,
        contextIsolation: true
      }
    };
  }

  private getWindowState(process: BrowserWindow): DemanaWindowState {
    try {
      if (process.isDestroyed()) {
        return {
          isMinimized: false,
          isMaximized: false,
          isClosable: false,
          minimizable: false,
          maximizable: false
        }
      }

      return {
        isMinimized: process.isMinimized(),
        isMaximized: process.isMaximized(),
        isClosable: process.isClosable(),
        minimizable: process.minimizable,
        maximizable: process.maximizable
      }
    } catch (exception) {
      throw new Error(`Failed to get the state of a window: ${(exception as Error).message}`, { cause: exception })
    }
  }

  private createUiProcess(options: DemanaProcessOptions): BrowserWindow {
    try {
      const { mode, window } = options;

      const isDev = mode === 'development';

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
          devTools: isDev
        }
      });

      uiProcess.on('ready-to-show', () => {
        pushEventToProcess({ name: '@window:new', value: this.getWindowState(uiProcess) }, uiProcess)

        uiProcess.show();
      });

      uiProcess.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url);
        return { action: 'deny' };
      });

      // HMR for renderer base on electron-vite cli.
      // Load the remote URL for development or the local html file for production.
      if (isDev && process.env['ELECTRON_RENDERER_URL']) {
        uiProcess.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/ui/index.html`);
      } else {
        uiProcess.loadFile(window.content);
      }

      if (isDev) {
        uiProcess.webContents.openDevTools();
      } else {
        // Menu.setApplicationMenu(null)
      }

      return uiProcess;
    } catch (exception) {
      throw new Error(`Failed to create a Demana UI process: ${(exception as Error).message}`, {
        cause: exception
      });
    }
  }

  private createWorkerProcess(options: DemanaProcessOptions): BrowserWindow {
    try {
      const { mode, window } = options;

      const isDev = mode === 'development';

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
      });

      // HMR for renderer base on electron-vite cli.
      // Load the remote URL for development or the local html file for production.
      if (isDev && process.env['ELECTRON_RENDERER_URL']) {
        workerProcess.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/worker/index.html`);
      } else {
        workerProcess.loadFile(window.content);
      }

      if (isDev) {
        workerProcess.on('ready-to-show', () => {
          workerProcess.setTitle(window.title || 'worker-process');
          workerProcess.show();
        });

        workerProcess.webContents.openDevTools();
      }

      return workerProcess;
    } catch (exception) {
      throw new Error(`Failed to create a Demana worker process: ${(exception as Error).message}`, {
        cause: exception
      });
    }
  }

  createProcess(name: DemanaProcessType, options: DemanaProcessOptions): BrowserWindow {
    try {
      switch (name) {
        case 'ui':
          return this.createUiProcess(options);
        case 'worker':
          return this.createWorkerProcess(options);
        default:
          throw new Error(`'${name}' is not a known Demana process name.`);
      }
    } catch (exception) {
      throw new Error(`Failed to create a Demana process: ${(exception as Error).message}`, {
        cause: exception
      });
    }
  }
}
