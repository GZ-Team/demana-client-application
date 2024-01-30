import { app, BrowserWindow, ipcMain, nativeImage } from 'electron';
import { join } from 'path';
import { electronApp, optimizer } from '@electron-toolkit/utils';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';

import RuntimeConfigService from './services/runtimeConfigService';
import PreferencesService from './services/preferencesService';
import TemporaryDataService from './services/temporaryDataService';
import SessionService from './services/sessionService';
import PrinterService from './services/printerService';
import TrayService from './services/trayService';
import TranslationService from './services/translationService';
import NotificationService from './services/notificationService';
import ProcessService, { DemanaPreloadScriptPath } from './services/processService';

import { pushEventToProcess } from './utils/eventUtils';
import { getBrowserWindowByProcessWebContents } from './utils/processUtils';
import { parseLocale } from './utils/i18nUtils';

import type {
  DemanaLocaleCode,
  DemanaLocaleTranslation,
  DemanaMessage,
  DemanaPreferences,
  DemanaPrintingConfiguration,
  DemanaTemporaryDataDto,
  Optional
} from './../types';

import demanaLogo from '../../resources/demana.png';

import useLogger from './utils/loggerUtils';

const { logger } = useLogger();

let isApplicationBeingClosed = false;
const icon = nativeImage.createFromDataURL(demanaLogo);

let sessionService: SessionService;
const runtimeConfigService = new RuntimeConfigService();
const preferenceService = new PreferencesService();
const temporaryDataService = new TemporaryDataService();
const translationService = new TranslationService();
const printerService = new PrinterService();
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
      mode: runtimeConfigService.isDev ? 'development' : 'production',
      events: {
        close: () => {
          if (!isApplicationBeingClosed) {
            notificationService.showNotification({
              title: translationService.translate('notifications.runningInbackground.title'),
              message: translationService.translate('notifications.runningInbackground.message'),
              icon
            });
          }
        }
      }
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

  ipcMain.on(
    'setPrintingConfiguration',
    (_event, printingConfiguration: DemanaPrintingConfiguration): void => {
      printerService.printingConfiguration = printingConfiguration;
    }
  );

  // PREFERENCES
  ipcMain.on(
    'setPreferences',
    (_event, preferencesUpdate: Optional<DemanaPreferences, 'language'>) => {
      preferenceService.preferences = preferencesUpdate;
    }
  );

  ipcMain.handle('getPreferences', (_event): DemanaPreferences => {
    return preferenceService.preferences;
  });

  // RUNTIME CONFIGURATION
  ipcMain.handle('getRuntimeConfiguration', (_event): Record<string, unknown> => {
    return runtimeConfigService.publicRuntimeConfig;
  });

  // TEMPORARY DATA
  ipcMain.handle(
    'getTemporaryData',
    (_event): Optional<DemanaTemporaryDataDto, 'redirectionRoute'> => {
      const { currentRouteName } = temporaryDataService.data;

      return {
        redirectionRoute: currentRouteName
      };
    }
  );

  ipcMain.on(
    'setTemporaryData',
    (_event, { key, value }: { key: keyof DemanaTemporaryDataDto; value: string | null }): void => {
      switch (key) {
        case 'redirectionRoute':
          temporaryDataService.currentRouteName = value;
          break;
      }
    }
  );

  // I18N
  ipcMain.handle('getAvailableLocaleCodes', (_event): DemanaLocaleCode[] => {
    return translationService.availableLocaleCodes;
  });

  ipcMain.handle(
    'getAllTranslations',
    (_event): Record<DemanaLocaleCode, DemanaLocaleTranslation> => {
      return translationService.allTranslations;
    }
  );

  // APP BEHAVIOUR
  ipcMain.handle('minimizeWindow', (event): boolean => {
    try {
      const senderProcess = getBrowserWindowByProcessWebContents(event.sender);

      if (senderProcess.minimizable) {
        senderProcess.minimize();
      }

      return senderProcess.isMinimized();
    } catch (exception) {
      throw new Error(`Failed to minimize a window: ${(exception as Error).message}`, {
        cause: exception
      });
    }
  });

  ipcMain.handle('maximizeWindow', (event): boolean => {
    try {
      const senderProcess = getBrowserWindowByProcessWebContents(event.sender);

      if (senderProcess.maximizable) {
        senderProcess.maximize();
      }

      return senderProcess.isMaximized();
    } catch (exception) {
      throw new Error(`Failed to maximize a window: ${(exception as Error).message}`, {
        cause: exception
      });
    }
  });

  ipcMain.handle('restoreWindow', (event): boolean => {
    try {
      const senderProcess = getBrowserWindowByProcessWebContents(event.sender);

      senderProcess.unmaximize();

      return senderProcess.isMaximized();
    } catch (exception) {
      throw new Error(`Failed to restore a window: ${(exception as Error).message}`, {
        cause: exception
      });
    }
  });

  ipcMain.handle('closeWindow', (event): boolean => {
    try {
      const senderProcess = getBrowserWindowByProcessWebContents(event.sender);

      if (senderProcess.closable) {
        senderProcess.close();
      }

      return senderProcess.isDestroyed();
    } catch (exception) {
      throw new Error(`Failed to close a window: ${(exception as Error).message}`, {
        cause: exception
      });
    }
  });

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
      useLogger({ service, isMainProcess: false }).logger.log(level, message, meta);
    }
  );
}

function initializeServices(): void {
  preferenceService.setDefaultValues({ language: parseLocale(app.getLocale()) });
  temporaryDataService.setDefaultValues();
  printerService.setDefaultValues();

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
    .buildTrayContextMenu()
    .on('click', () => showMainUiProcess());
}

function showMainUiProcess(routeName?: string): void {
  const mainUiProcess = getOrCreateMainUiProcess();
  sessionService = new SessionService(mainUiProcess.id);

  if (routeName) {
    temporaryDataService.currentRouteName = routeName;
  }

  if (!mainUiProcess.isVisible()) {
    mainUiProcess.show();
  } else if (mainUiProcess.isVisible() && routeName) {
    pushEventToProcess({ name: '@window:external-navigation', value: routeName }, mainUiProcess);
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
    mode: runtimeConfigService.isDev ? 'development' : 'production',
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

  initializeIpcHandlers();
  initializeServices();

  mainUiProcess.setTitle(translationService.translate('globals.applicationName'));

  // TO-DO: remove after development
  setInterval(
    () => pushEventToProcess({ name: '@orders:new', value: 'test' }, mainWorkerProcess),
    10 * 1000
  );

  if (runtimeConfigService.isDev) {
    try {
      await installExtension(VUEJS_DEVTOOLS);
      logger.debug('Vue devtools are installed!');
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
