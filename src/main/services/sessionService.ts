import RuntimeConfigService from './runtimeConfigService';

import { getBrowserWindowByProcessId } from '../utils/processUtils';
import useLogger from '../utils/loggerUtils';
import { pushEventToProcess } from '../utils/eventUtils';
import { isLocal } from '../utils/environmentUtils.ts';

import type {
  BrowserWindow,
  Cookie,
  Cookies,
  CookiesGetFilter,
  CookiesSetDetails,
  SerialPort,
  Session,
  USBDevice
} from 'electron';
import type { Logger } from 'winston';
import type { DemanaEventName, DemanaRequestHeaders } from '../../types';
import type { DemanaService } from '../types';

const ALLOWED_PERMISSIONS = ['usb', 'serial'];

type DemanaCookieDetails = CookiesGetFilter & CookiesSetDetails;

export default class SessionService extends RuntimeConfigService implements DemanaService {
  private logger: Logger = useLogger({ service: 'SessionService' }).logger;

  private _uiProcessId: number;
  private _workerProcessId: number;

  private grantedDeviceThroughPermHandler: SerialPort | USBDevice | null = null;
  private refreshingAuthentication = false;

  constructor(uiProcessId: number, workerProcessId: number) {
    super();

    this._uiProcessId = uiProcessId;
    this._workerProcessId = workerProcessId;

    this.setup();
  }

  private get cookies(): Cookies {
    return this.windowSession.cookies;
  }

  private get accessTokenName(): string {
    return this.runtimeConfig.VITE_ACCESS_TOKEN_NAME;
  }

  private get refreshTokenName(): string {
    return this.runtimeConfig.VITE_REFRESH_TOKEN_NAME;
  }

  private get defaultCookieDetails(): DemanaCookieDetails {
    return {
      url: this.runtimeConfig.BASE_URL,
      secure: isLocal()
    };
  }

  get uiProcess(): BrowserWindow {
    return getBrowserWindowByProcessId(this._uiProcessId);
  }

  set uiProcess(newUiProcess: BrowserWindow) {
    this._uiProcessId = newUiProcess.id;
  }

  get workerProcess(): BrowserWindow {
    return getBrowserWindowByProcessId(this._workerProcessId);
  }

  set workerProcess(newWorkerProcess: BrowserWindow) {
    this._workerProcessId = newWorkerProcess.id;
  }

  get windowSession(): Session {
    return this.uiProcess.webContents.session;
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

  private notifyProcesses(eventName: DemanaEventName, value: unknown): void {
    [this.uiProcess, this.workerProcess].forEach((process) =>
      pushEventToProcess({ name: eventName, value }, process)
    );
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      return (
        await Promise.allSettled([
          this.hasCookieByName(this.accessTokenName),
          this.hasCookieByName(this.refreshTokenName)
        ])
      )
        .map((promiseResult) =>
          promiseResult.status === 'fulfilled' ? promiseResult.value : false
        )
        .reduce((authenticated, hasCookie) => authenticated && hasCookie, true);
    } catch (exception) {
      return false;
    }
  }

  async refreshAuthenticationSession(): Promise<void> {
    try {
      if (this.refreshingAuthentication) {
        return;
      }

      this.refreshingAuthentication = true;
      const refreshToken = await this.getRefreshToken();

      if (!refreshToken) {
        return;
      }

      throw new Error('refreshAuthenticationSession is not implemented yet.');
    } catch (exception) {
      this.logger.error(
        `Failed to refresh the authentication of a session: ${(exception as Error).message}`
      );
    } finally {
      this.refreshingAuthentication = false;
    }
  }

  async endAuthenticatedSession(): Promise<void> {
    try {
      await Promise.all([
        this.removeCookie(this.accessTokenName),
        this.removeCookie(this.refreshTokenName)
      ]);

      this.notifyProcesses('@session:authenticated', await this.isAuthenticated());
    } catch (exception) {
      this.logger.error(
        `Failed to end the session authentication: ${(exception as Error).message}`
      );
    }
  }

  async getAccessToken(): Promise<Cookie | null> {
    try {
      return await this.getCookieByName(this.accessTokenName);
    } catch (exception) {
      this.logger.error(`Failed to get the access token: ${(exception as Error).message}'`);
      return null;
    }
  }

  async getRefreshToken(): Promise<Cookie | null> {
    try {
      return await this.getCookieByName(this.refreshTokenName);
    } catch (exception) {
      this.logger.error(`Failed to get the refresh token: ${(exception as Error).message}'`);
      return null;
    }
  }

  async getCookieByName(name: string, options?: DemanaCookieDetails): Promise<Cookie | null> {
    try {
      const cookiesByName = await this.cookies.get({
        ...this.defaultCookieDetails,
        ...(options || {}),
        name
      });

      return cookiesByName.find((cookie) => cookie.name === name) || null;
    } catch (exception) {
      throw new Error(
        `Failed to get a cookie with the name '${name}: ${(exception as Error).message}'`,
        { cause: exception }
      );
    }
  }

  async hasCookieByName(name: string, options?: DemanaCookieDetails): Promise<boolean> {
    try {
      return !!(await this.getCookieByName(name, options));
    } catch (exception) {
      return false;
    }
  }

  async setCookie(name: string, value: string, options?: CookiesSetDetails): Promise<void> {
    try {
      this.logger.info(`Setting a cookie with the name '${name}.`);

      console.log({option: {
          ...this.defaultCookieDetails,
          ...options,
          location: this.uiProcess.webContents
        }})

      await this.cookies.set({
        ...this.defaultCookieDetails,
        ...(options || {}),
        name,
        value
      });
    } catch (exception) {
      throw new Error(
        `Failed to set a cookie with the name '${name}: ${(exception as Error).message}'`,
        { cause: exception }
      );
    }
  }

  async removeCookie(name: string, url?: string): Promise<void> {
    try {
      this.logger.info(`Removing a cookie with the name '${name}.`);

      await this.cookies.remove(url || this.defaultCookieDetails.url, name);
    } catch (exception) {
      throw new Error(
        `Failed to remove a cookie with the name '${name}: ${(exception as Error).message}'`,
        { cause: exception }
      );
    }
  }
}
