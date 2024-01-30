import { getBrowserWindowByProcessId } from '../utils/processUtils';

import useLogger from '../utils/loggerUtils';

import type { SerialPort, Session, USBDevice } from 'electron';
import type { Logger } from 'winston';

const ALLOWED_PERMISSIONS = ['usb', 'serial'];

export default class SessionService {
  private logger: Logger = useLogger({ service: 'SessionService' }).logger;

  private windowId: number;

  private grantedDeviceThroughPermHandler: SerialPort | USBDevice | null = null;

  constructor(windowId: number) {
    this.windowId = windowId;
    this.setup();
  }

  get windowSession(): Session {
    return getBrowserWindowByProcessId(this.windowId).webContents.session;
  }

  private setup(): void {
    this.addUsbDeviceEventHandlers();
    this.addSerialDeviceEventHandlers();
    this.addDevicePermissionHandeling();
  }

  private addUsbDeviceEventHandlers(): void {
    this.windowSession.on('select-usb-device', (event, details, callback) => {
      // Add events to handle devices being added or removed before the callback on `select-usb-device` is called.

      this.windowSession.on('usb-device-added', (_event, _device) => {
        // console.log('usb-device-added FIRED WITH', device)
        // Optionally update details.deviceList
      });

      this.windowSession.on('usb-device-removed', (_event, _device) => {
        // console.log('usb-device-removed FIRED WITH', device)
        // Optionally update details.deviceList
      });

      event.preventDefault();

      const deviceToReturn = (details.deviceList || []).find(
        (device) => device.productId === this.grantedDeviceThroughPermHandler?.productId
      );

      if (deviceToReturn) {
        callback(deviceToReturn.deviceId);
      } else {
        callback();
      }
    });
  }

  private addSerialDeviceEventHandlers(): void {
    this.windowSession.on('select-serial-port', (event, portList, _webContents, callback) => {
      // Add listeners to handle ports being added or removed before the callback for `select-serial-port`
      // is called.
      this.windowSession.on('serial-port-added', (_event, port) => {
        this.logger.debug('serial-port-added FIRED WITH', port);
        // Optionally update portList to add the new port
      });

      this.windowSession.on('serial-port-removed', (_event, port) => {
        this.logger.debug('serial-port-removed FIRED WITH', port);
        // Optionally update portList to remove the port
      });

      event.preventDefault();

      const deviceToReturn = (portList || []).find(
        (device) => device.productId === this.grantedDeviceThroughPermHandler?.productId
      );

      this.logger.debug({ deviceToReturn, portList });

      if (deviceToReturn) {
        callback(deviceToReturn.portId);
      } else {
        callback('');
      }
    });
  }

  private addDevicePermissionHandeling(): void {
    this.addPermissionRequestHandler();
    this.addDevicePermissionHandler();
    this.addPermissionCheckHandler();
  }

  private addPermissionRequestHandler(): void {
    this.windowSession.setPermissionRequestHandler((_webContents, permission, callback) => {
      callback(ALLOWED_PERMISSIONS.includes(permission));
    });
  }

  private addDevicePermissionHandler(): void {
    this.windowSession.setDevicePermissionHandler(({ device, deviceType }) => {
      // TODO: INCREASE SECURITY BY CHECKING DETAILS (device, deviceType, origin)
      // console.log('SET PERMISSION', { device, deviceType, origin })

      switch (deviceType) {
        case 'serial':
          this.grantedDeviceThroughPermHandler = <SerialPort>device;
          return !!device['device_instance_id'];
        case 'usb':
          this.grantedDeviceThroughPermHandler = <USBDevice>device;
          return !!this.grantedDeviceThroughPermHandler.productId;
        default:
          return false;
      }
    });
  }

  private addPermissionCheckHandler(): void {
    this.windowSession.setPermissionCheckHandler(
      (_webContents, permission, _requestingOrigin, _details) => {
        // if (new URL(requestingOrigin).hostname === 'some-host' && permission === 'notifications') {
        //     return true // granted
        // }

        return ALLOWED_PERMISSIONS.includes(permission);

        //return false // denied
      }
    );
  }
}
