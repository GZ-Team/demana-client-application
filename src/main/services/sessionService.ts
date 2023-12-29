import { BrowserWindow } from 'electron'

import type { SerialPort, Session, USBDevice } from 'electron'

const ALLOWED_PERMISSIONS = [
  'usb',
  'serial'
]

export default class {
  private grantedDeviceThroughPermHandler: SerialPort | USBDevice | null = null

  constructor(
    private windowId: number
  ) {
    this.setup()
  }

  get windowSession(): Session {
    const selectedWindow = BrowserWindow.fromId(this.windowId)

    if (!selectedWindow) {
      throw new Error(`Failed to find BrowserWindow with id: ${this.windowId}`)
    }

    return selectedWindow.webContents.session
  }

  private setup(): void {
    this.addUsbDeviceEventHandlers()
    this.addSerialDeviceEventHandlers()
    this.addDevicePermissionHandeling()
  }

  private addUsbDeviceEventHandlers(): void {
    this.windowSession.on('select-usb-device', (event, details, callback) => {
      // Add events to handle devices being added or removed before the callback on `select-usb-device` is called.

      this.windowSession.on('usb-device-added', (event, device) => {
        // console.log('usb-device-added FIRED WITH', device)
        // Optionally update details.deviceList
      })

      this.windowSession.on('usb-device-removed', (event, device) => {
        // console.log('usb-device-removed FIRED WITH', device)
        // Optionally update details.deviceList
      })

      event.preventDefault()

      const deviceToReturn = (details.deviceList || []).find((device) =>
        device.productId === this.grantedDeviceThroughPermHandler?.productId
      )

      if (deviceToReturn) {
        callback(deviceToReturn.deviceId)
      } else {
        callback()
      }
    })
  }

  private addSerialDeviceEventHandlers(): void {
    this.windowSession.on('select-serial-port', (event, portList, webContents, callback) => {
      // Add listeners to handle ports being added or removed before the callback for `select-serial-port`
      // is called.
      this.windowSession.on('serial-port-added', (event, port) => {
        console.log('serial-port-added FIRED WITH', port)
        // Optionally update portList to add the new port
      })

      this.windowSession.on('serial-port-removed', (event, port) => {
        console.log('serial-port-removed FIRED WITH', port)
        // Optionally update portList to remove the port
      })

      event.preventDefault()

      const deviceToReturn = (portList || []).find((device) =>
        device.productId === this.grantedDeviceThroughPermHandler?.productId
      )

      console.log({ deviceToReturn, portList })

      if (deviceToReturn) {
        callback(deviceToReturn.portId)
      } else {
        callback('')
      }
    })
  }

  private addDevicePermissionHandeling(): void {
    this.addPermissionRequestHandler()
    this.addDevicePermissionHandler()
    this.addPermissionCheckHandler()
  }

  private addPermissionRequestHandler(): void {
    this.windowSession.setPermissionRequestHandler((webContents, permission, callback) => {
      callback(ALLOWED_PERMISSIONS.includes(permission))
    })
  }

  private addDevicePermissionHandler(): void {
    this.windowSession.setDevicePermissionHandler(({ device, deviceType, origin }) => {
      // TODO: INCREASE SECURITY BY CHECKING DETAILS (device, deviceType, origin)
      // console.log('SET PERMISSION', { device, deviceType, origin })

      switch (deviceType) {
        case 'serial':
          this.grantedDeviceThroughPermHandler = <SerialPort>device
          return !!device['device_instance_id']
        case 'usb':
          this.grantedDeviceThroughPermHandler = <USBDevice>device
          return !!this.grantedDeviceThroughPermHandler.productId
        default:
          return false
      }
    })
  }

  private addPermissionCheckHandler(): void {
    this.windowSession.setPermissionCheckHandler(
      (webContents, permission, requestingOrigin, details) => {
        // if (new URL(requestingOrigin).hostname === 'some-host' && permission === 'notifications') {
        //     return true // granted
        // }

        return ALLOWED_PERMISSIONS.includes(permission)

        //return false // denied
      }
    )
  }
}
