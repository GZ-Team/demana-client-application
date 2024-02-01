import { _electron } from "@playwright/test"

import type { ElectronApplication, Page } from "@playwright/test"

type ElectronContextOptions = {
    executablePath: string;
}

export default class ElectronContext {
    private executablePath: string

    private _application: ElectronApplication | null = null

    constructor(options: ElectronContextOptions) {
        this.executablePath = options.executablePath
    }

    get application(): ElectronApplication {
        try {
            if (this._application == null) {
                throw new Error("the Electron application is null.")
            }

            return this._application
        } catch (exception) {
            throw new Error(`Failed to the ElectronApplication from the context: ${(exception as Error).message}`, { cause: exception })
        }
    }

    get windows(): Page[] {
        return this.application.windows()
    }

    async launchApplication(): Promise<ElectronApplication> {
        return await _electron.launch({ args: [this.executablePath] })
    }

    async waitMilliseconds(milliseconds: number): Promise<void> {
        return new Promise<void>((resolve) => {
            setTimeout(() => resolve(), milliseconds)
        })
    }

    async waitSeconds(seconds: number): Promise<void> {
        return this.waitMilliseconds(1000 * seconds)
    }

    async setup(): Promise<void> {
        try {
            this._application = await this.launchApplication()

            const page = await this.application.context().waitForEvent('page')
            await page.waitForLoadState('domcontentloaded')
        } catch (exception) {
            throw new Error(`Failed to setup: ${(exception as Error).message}`, { cause: exception })
        }
    }
}