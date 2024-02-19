import type { CookiesGetFilter, CookiesSetDetails } from 'electron'

class Device {
    readonly deviceId: string
    readonly name: string

    constructor(deviceId: string, name: string) {
        this.deviceId = deviceId
        this.name = name
    }
}

export class PrinterDevice extends Device {
    isDefault = false
    portName: string | null
    printerStatus: string

    constructor(
        deviceId: string,
        name: string,
        isDefault: boolean,
        portName: string,
        printerStatus: string
    ) {
        super(deviceId, name)
        this.isDefault = isDefault
        this.portName = portName
        this.printerStatus = printerStatus
    }
}

export enum TicketType {
    ORDER_TICKET,
    TEST_TICKET
}

export type DemanaLocaleCode = 'en' | 'es' | 'ca';

export type DemanaLocaleTranslation = {
    globals: {
        applicationName: string;
        languages: Record<string, string>;
        validation: {
            general: {
                'name-required': string;
                'email-valid': string;
                'max-length': string;
                'min-value': string;
                'max-value': string;
                required: string;
                between: string;
            };
        };
    };
    notifications: {
        runningInBackground: {
            title: string;
            message: string;
        };
    };
    tray: {
        links: {
            preferences: string;
        };
        actions: {
            open: string;
            exit: string;
        };
    };
    pages: {
        printerConfiguration: {
            title: string;
            printerName: string;
            paperWidth: string;
            margin: string;
            automatic: string;
            actions: {
                delete: string;
                save: string;
                test: string;
            };
        };
        preferences: {
            title: string;
            applicationLanguage: string;
        };
    };
};

export type DemanaLocaleTranslationDto = {
    locale: DemanaLocaleCode;
    translations: DemanaLocaleTranslation;
};

export type DemanaApiEndPoint = 'setSelectedPrinter' | 'getLocaleTranslations';

type DemanaOrderEventName = '@orders:new';
type DemanaMessageEventName = '@messages:new';
type DemanaWindowEventName = '@window:new' | '@window:external-navigation';
type DemanaSessionEventName = '@session:authenticated';
type DemanaInfoEventName = 'getVenueId';

export type DemanaEventName =
    | DemanaOrderEventName
    | DemanaMessageEventName
    | DemanaWindowEventName
    | DemanaSessionEventName
    | DemanaInfoEventName

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

export type DemanaPrintingConfiguration = {
    automatic?: boolean;
    paperWidth?: number;
    paperMargin?: number;
};

export type DemanaPreferences = {
    language: DemanaLocaleCode;
};

export type DemanaTemporaryData = {
    currentRouteName: string;
};

export type DemanaTemporaryDataDto = {
    redirectionRoute: string;
};

export type DemanaAppData = {
    id: string;
}

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

// https://www.electronjs.org/docs/latest/api/app#appgetpathname
export type StorageKey =
    | 'home'
    | 'appData'
    | 'userData'
    | 'sessionData'
    | 'temp'
    | 'exe'
    | 'module'
    | 'desktop'
    | 'documents'
    | 'downloads'
    | 'music'
    | 'pictures'
    | 'videos'
    | 'recent'
    | 'logs'
    | 'crashDumps';

export type DemanaLogLevel = 'crit' | 'error' | 'warning' | 'info' | 'debug';

export interface DemanaLogger {
    crit: (message: string, ...meta: unknown[]) => void;
    error: (message: string, ...meta: unknown[]) => void;
    warning: (message: string, ...meta: unknown[]) => void;
    info: (message: string, ...meta: unknown[]) => void;
    debug: (message: string, ...meta: unknown[]) => void;
}

export type DemanaRequestHeaders = {
    authorization?: string;
    'refresh-token'?: string;
    'demana-client-id'?: string;
};

export type Paths<T> = T extends object
    ? {
        [K in keyof T]: `${Exclude<K, symbol>}${'' | `.${Paths<T[K]>}`}`;
    }[keyof T]
    : never;

export type DemanaCookieDetails = Optional<CookiesGetFilter & CookiesSetDetails, 'url'>;
