import useLogger from '../utils/loggerUtils'

import type { Logger } from 'winston'
import type { DemanaService } from '../types'

type DemanaContext = {
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
  };
};

export type DemanaServiceName = keyof DemanaContext['services'];

export default class ContextService {
    private static logger: Logger = useLogger({ service: 'context' }).logger
    private static _instance: ContextService

    private static context: DemanaContext = {
        services: {}
    }

    private constructor() {}

    static get instance(): ContextService {
        if (!this._instance) {
            this._instance = new ContextService()
        }

        return this._instance
    }

    hasServiceByName(name: DemanaServiceName): boolean {
        return !!ContextService.context.services[name]
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
