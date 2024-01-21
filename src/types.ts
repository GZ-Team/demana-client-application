class Device {
  readonly deviceId: string;
  readonly name: string;

  constructor(deviceId: string, name: string) {
    this.deviceId = deviceId;
    this.name = name;
  }
}

export class PrinterDevice extends Device {
  isDefault = false;
  portName: string | null;
  printerStatus: string;

  constructor(
    deviceId: string,
    name: string,
    isDefault: boolean,
    portName: string,
    printerStatus: string
  ) {
    super(deviceId, name);
    this.isDefault = isDefault;
    this.portName = portName;
    this.printerStatus = printerStatus;
  }
}

export enum TicketType {
  ORDER_TICKET,
  TEST_TICKET
}

export type DemanaLocaleCode = 'en' | 'es' | 'ca'

export type DemanaLocaleTranslation = {
  globals: {
    applicationName: string
    languages: Record<string, string>,
    validation: {
      general: {
        'name-required': string
        'email-valid': string
        'max-length': string
        'min-value': string
        'max-value': string
        required: string
        between: string
      }
    }
  },
  notifications: {
    runningInbackground: {
      title: string
      message: string
    }
  },
  tray: {
    actions: {
      open: string
      exit: string
    }
  },
  pages: {
    printerConfiguration: {
      title: string
      printerName: string
      paperWidth: string
      margin: string
      automatic: string
      actions: {
        delete: string
        save: string
        test: string
      }
    },
    preferences: {
      title: string
      applicationLanguage: string
    }
  }
}

export type DemanaLocaleTranslationDto = {
  locale: DemanaLocaleCode;
  translations: DemanaLocaleTranslation;
};

export type DemanaApiEndPoint = 'setSelectedPrinter' | 'getLocaleTranslations';

type DemanaOrderEventName = '@orders:new';
type DemanaMessageEventName = '@messages:new';
type DemanaWindowEventName = '@window:new';

export type DemanaEventName = DemanaOrderEventName | DemanaMessageEventName | DemanaWindowEventName;

export type DemanaEvent<T> = {
  name: DemanaEventName;
  value: T;
};

export type DemanaProcessType = 'ui' | 'worker';

export type DemanaMessageBody = 'test-printer';

export type DemanaMessage = {
  target: DemanaProcessType;
  content: DemanaMessageBody;
};

export type DemanaWindowState = {
  isMinimized: boolean
  isMaximized: boolean
  isClosable: boolean
  minimizable: boolean
  maximizable: boolean
}

export type DemanaPrintingConfiguration = {
  automatic?: boolean
  paperWidth?: number
  paperMargin?: number
}

export type DemanaPreferences = {
  language: DemanaLocaleCode
}

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>