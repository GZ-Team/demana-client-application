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

export type DemanaLocaleTranslationItem = Record<string, string>

export type DemanaLocaleTranslation = {
  [key: string]: DemanaLocaleTranslationItem | DemanaLocaleTranslation
}

export type DemanaLocaleTranslationDto = {
  locale: string,
  translations: DemanaLocaleTranslation
}

export type DemanaApiEndPoint = 'setSelectedPrinter' | 'getLocaleTranslations'