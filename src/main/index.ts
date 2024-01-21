import { app, BrowserWindow, ipcMain, nativeImage } from 'electron';
import { join } from 'path';
import { electronApp, optimizer } from '@electron-toolkit/utils';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';

import StorageService from './services/storageService';
import PreferencesService from './services/preferencesService';
import SessionService from './services/sessionService';
import PrinterService from './services/printerService';
import TrayService from './services/trayService';
import TranslationService from './services/translationService';
import NotificationService from './services/notificationService';
import ProcessService, { DemanaPreloadScriptPath } from './services/processService';

import { isDev } from './utils/configUtils';
import { pushEventToProcess } from './utils/eventUtils';
import { getBrowserWindowByProcessWebContents } from './utils/processUtils';
import { parseLocale } from './utils/i18nUtils';

import type { DemanaLocaleCode, DemanaLocaleTranslation, DemanaMessage, DemanaPreferences, DemanaPrintingConfiguration, Optional } from './../types';

import demanaLogo from '../../resources/demana.png';

let isApplicationBeingClosed = false;
const icon = nativeImage.createFromDataURL(demanaLogo);

const userDataStore = new StorageService('userData', 'configuration.json');
let preferenceService: PreferencesService
let translationService: TranslationService;
let printerService: PrinterService;
const notificationService = new NotificationService(icon);
const processService = new ProcessService();

let mainWorkerProcess: BrowserWindow;
let mainUiProcess: BrowserWindow;

function getOrCreateMainUiProcess(): BrowserWindow {
  if (!mainUiProcess || mainUiProcess.isDestroyed()) {
    mainUiProcess = processService.createProcess('ui', {
      window: {
        icon,
        content: join(__dirname, '../renderer/ui/index.html'),
        preload: DemanaPreloadScriptPath.UI
      },
      mode: isDev() ? 'development' : 'production'
    });
  }

  return mainUiProcess;
}

function initializeIpcHandlers(): void {
  // MESSAGES
  ipcMain.on('sendMessage', (_event, message: DemanaMessage): void => {
    try {
      switch (message.target) {
        case 'ui':
          return pushEventToProcess<DemanaMessage>(
            { name: '@messages:new', value: message },
            mainUiProcess
          );
        case 'worker':
          return pushEventToProcess<DemanaMessage>(
            { name: '@messages:new', value: message },
            mainWorkerProcess
          );
        default:
          throw new Error(`'${message.target}' is not a valid message target.`);
      }
    } catch (exception) {
      throw new Error(`Failed to process a received message: ${(exception as Error).message}`);
    }
  });

  // PRINTING
  ipcMain.handle('getSelectedPrinter', (_event): string => {
    return printerService.selectedPrinterId;
  });

  ipcMain.on('setSelectedPrinter', (_event, printerId: string): void => {
    printerService.selectedPrinterId = printerId;
  });

  ipcMain.handle('getPrintingConfiguration', (_event): DemanaPrintingConfiguration => {
    return printerService.printingConfiguration;
  });

  ipcMain.on('setPrintingConfiguration', (_event, printingConfiguration: DemanaPrintingConfiguration): void => {
    printerService.printingConfiguration = printingConfiguration;
  });

  // PREFERENCES
  ipcMain.on('setPreferences', (_event, preferencesUpdate: Optional<DemanaPreferences, 'language'>) => {
    preferenceService.preferences = preferencesUpdate
  })

  ipcMain.handle('getPreferences', (_event): DemanaPreferences => {
    return preferenceService.preferences;
  });

  // I18N
  ipcMain.handle('getAvailableLocaleCodes', (_event): DemanaLocaleCode[] => {
    return translationService.availableLocaleCodes;
  });

  ipcMain.handle('getAllTranslations', (_event): Record<DemanaLocaleCode, DemanaLocaleTranslation> => {
    return translationService.allTranslations;
  });

  // APP BEHAVIOUR
  ipcMain.handle('minimizeWindow', (event): boolean => {
    try {
      const senderProcess = getBrowserWindowByProcessWebContents(event.sender)

      if (senderProcess.minimizable) {
        senderProcess.minimize()
      }

      return senderProcess.isMinimized()
    } catch (exception) {
      throw new Error(`Failed to minimize a window: ${(exception as Error).message}`, { cause: exception })
    }
  });

  ipcMain.handle('maximizeWindow', (event): boolean => {
    try {
      const senderProcess = getBrowserWindowByProcessWebContents(event.sender)

      if (senderProcess.maximizable) {
        senderProcess.maximize()
      }

      return senderProcess.isMaximized()
    } catch (exception) {
      throw new Error(`Failed to maximize a window: ${(exception as Error).message}`, { cause: exception })
    }
  });

  ipcMain.handle('restoreWindow', (event): boolean => {
    try {
      const senderProcess = getBrowserWindowByProcessWebContents(event.sender)

      senderProcess.unmaximize()

      return senderProcess.isMaximized()
    } catch (exception) {
      throw new Error(`Failed to restore a window: ${(exception as Error).message}`, { cause: exception })
    }
  });

  ipcMain.handle('closeWindow', (event): boolean => {
    try {
      const senderProcess = getBrowserWindowByProcessWebContents(event.sender)

      if (senderProcess.closable) {
        senderProcess.close()
      }

      return senderProcess.isDestroyed()
    } catch (exception) {
      throw new Error(`Failed to close a window: ${(exception as Error).message}`, { cause: exception })
    }
  });
}

function initializeServices(): void {
  const { id } = getOrCreateMainUiProcess();

  new SessionService(id);

  preferenceService = new PreferencesService(userDataStore)
  preferenceService.setDefaultValues({ language: parseLocale(app.getLocale()) })

  translationService = new TranslationService(preferenceService);

  const { translate } = translationService;

  new TrayService({
    icon,
    contextMenuContent: [
      {
        label: translate('globals.applicationName'),
        enabled: false
      },
      {
        type: 'separator'
      },
      {
        label: translate('tray.actions.open'),
        type: 'normal',
        click: () => showMainUiProcess(),
        role: 'reload'
      },
      {
        label: translate('tray.actions.exit'),
        type: 'normal',
        click: () => beforeApplicationExit(),
        role: 'quit'
      }
    ]
  })
    .buildTrayContextMenu()
    .on('click', () => showMainUiProcess());

  printerService = new PrinterService(userDataStore);
  printerService.setDefaultValues()
}

function showMainUiProcess(): void {
  const mainUiProcess = getOrCreateMainUiProcess();

  if (!mainUiProcess.isVisible()) {
    mainUiProcess.show();
  }

  if (!mainUiProcess.isFocused()) {
    mainUiProcess.focus();
  }
}

function beforeApplicationExit(): void {
  isApplicationBeingClosed = true;
}

/**
 * This method will be called when Electron has finished
 * initialization and is ready to create browser windows.
 * Some APIs can only be used after this event occurs.
 */
app.whenReady().then(async () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('digital.demana');

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  mainWorkerProcess = processService.createProcess('worker', {
    mode: isDev() ? 'development' : 'production',
    window: {
      content: join(__dirname, '../renderer/worker/index.html'),
      icon,
      preload: DemanaPreloadScriptPath.WORKER
    }
  });

  mainWorkerProcess.on('close', (event) => {
    if (!isApplicationBeingClosed) {
      event.preventDefault();
    }
  });

  mainUiProcess = getOrCreateMainUiProcess();

  mainUiProcess.on('close', () => {
    if (!isApplicationBeingClosed) {
      const { translate } = translationService;

      notificationService.showNotification({
        title: translate('notifications.runningInbackground.title'),
        message: translate('notifications.runningInbackground.message'),
        icon
      });
    }
  });

  initializeIpcHandlers();
  initializeServices();

  mainUiProcess.setTitle(translationService.translate('globals.applicationName'));

  // TO-DO: remove after development
  setInterval(
    () => pushEventToProcess({ name: '@orders:new', value: 'test' }, mainWorkerProcess),
    10 * 1000
  );

  if (isDev()) {
    try {
      await installExtension(VUEJS_DEVTOOLS);
      console.log('Vue devtools are installed!');
    } catch (exception) {
      console.error('Failed to install Vue devtools', exception);
    }
  }

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      getOrCreateMainUiProcess();
    }
  });
});

/**
 * Hides the main window, except on macOS.
 * There, it's common for applications and their menu bar to stay active
 * until the user quits explicitly with Cmd + Q.
 */
app.on('window-all-closed', () => {
  if (isApplicationBeingClosed) {
    app.quit();
  }
});

/**
 * Actions done before ending the application.
 */
app.on('before-quit', () => {
  beforeApplicationExit();
});
