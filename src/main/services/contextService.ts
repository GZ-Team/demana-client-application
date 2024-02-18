import useLogger from '../utils/loggerUtils'

import type { Logger } from 'winston'
import type { DemanaClient, DemanaService } from '../types'
import { BrowserWindow } from 'electron'

type DemanaContext = {
    processes: {
        ui?: BrowserWindow
        worker?: BrowserWindow
    }
  services: {
    app?: DemanaService;
    session?: DemanaService;
    runtimeConfig?: DemanaService;
    preferences?: DemanaService;
    temporaryData?: DemanaService;
    translation?: DemanaService;
    notification?: DemanaService;
    printer?: DemanaService;
    process?: DemanaService;
    tray?: DemanaService;
    ticket?: DemanaService
  }
  clients: {
      amqp?: DemanaClient
  }
};

export type DemanaProcessName = keyof DemanaContext['processes'];
export type DemanaServiceName = keyof DemanaContext['services'];
export type DemanaClientName = keyof DemanaContext['clients'];

export default class ContextService {
    private static logger: Logger = useLogger({ service: 'context' }).logger
    private static _instance: ContextService

    private static context: DemanaContext = {
        processes: {},
        services: {},
        clients: {}
    }

    private constructor() {}

    static get instance(): ContextService {
        if (!this._instance) {
            this._instance = new ContextService()
        }

        return this._instance
    }

    hasProcessByName(name: DemanaProcessName): boolean {
        return !!ContextService.context.processes[name]
    }

    hasServiceByName(name: DemanaServiceName): boolean {
        return !!ContextService.context.services[name]
    }

    hasClientByName(name: DemanaClientName): boolean {
        return !!ContextService.context.clients[name]
    }

    getProcessByName(name: DemanaProcessName): BrowserWindow {
        try {
            const selectedProcess = ContextService.context.processes[name]

            if (!selectedProcess) {
                throw new Error('the process was not found.')
            }

            return selectedProcess
        } catch (exception) {
            throw new Error(
                `Failed to get the process with name '${name}': ${(exception as Error).message}`,
                { cause: exception }
            )
        }
    }

    getAllProcesses(): BrowserWindow[] {
        return Object.values(ContextService.context.processes)
    }

    getServiceByName<T extends DemanaService>(name: DemanaServiceName): T {
        try {
            const selectedService = ContextService.context.services[name]

            if (!selectedService) {
                throw new Error('the service was not found.')
            }

            return selectedService as T
        } catch (exception) {
            throw new Error(
                `Failed to get the service with name '${name}': ${(exception as Error).message}`,
                { cause: exception }
            )
        }
    }

    getClientByName<T extends DemanaService>(name: DemanaClientName): T {
        try {
            const selectedClient = ContextService.context.clients[name]

            if (!selectedClient) {
                throw new Error('the client was not found.')
            }

            return selectedClient as T
        } catch (exception) {
            throw new Error(
                `Failed to get the client with name '${name}': ${(exception as Error).message}`,
                { cause: exception }
            )
        }
    }

    registerProcess(name: DemanaProcessName, process: BrowserWindow): BrowserWindow {
        try {
            ContextService.context.processes[name] = process

            return this.getProcessByName(name)
        } catch (exception) {
            throw new Error(
                `Failed to register the process with name '${name}': ${(exception as Error).message}`,
                { cause: exception }
            )
        }
    }

    registerService<T extends DemanaService>(name: DemanaServiceName, service: T): T {
        try {
            if (this.hasServiceByName(name)) {
                throw new Error('a service with this name already exists.')
            }

            ContextService.context.services[name] = service

            return this.getServiceByName(name)
        } catch (exception) {
            throw new Error(
                `Failed to register the service with name '${name}': ${(exception as Error).message}`,
                { cause: exception }
            )
        }
    }

    registerClient<T extends DemanaClient>(name: DemanaClientName, client: T): T {
        try {
            if (this.hasClientByName(name)) {
                throw new Error('a client with this name already exists.')
            }

            ContextService.context.clients[name] = client

            return this.getClientByName(name)
        } catch (exception) {
            throw new Error(
                `Failed to register the client with name '${name}': ${(exception as Error).message}`,
                { cause: exception }
            )
        }
    }

    registerServices(services: DemanaContext['services']): DemanaContext['services'] {
        return Object.entries(services).reduce((registeredServices, [name, service]) => {
            try {
                return {
                    ...registeredServices,
                    [name]: this.registerService(name as DemanaServiceName, service)
                }
            } catch (exception) {
                ContextService.logger.error((exception as Error).message)
                return registeredServices
            }
        }, {})
    }
}
