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

export type DemanaLocaleTranslationItem = Record<string, string>;

export type DemanaLocaleTranslation = {
  [key: string]: DemanaLocaleTranslationItem | DemanaLocaleTranslation;
};

export type DemanaLocaleTranslationDto = {
  locale: string;
  translations: DemanaLocaleTranslation;
};

export type DemanaApiEndPoint = 'setSelectedPrinter' | 'getLocaleTranslations';

type DemanaOrderEventName = '@orders:new';
type DemanaMessageEventName = '@messages:new';

export type DemanaEventName = DemanaOrderEventName | DemanaMessageEventName;

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
