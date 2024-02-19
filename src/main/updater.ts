import { autoUpdater } from 'electron-updater'

import useLogger from './utils/loggerUtils'

import type { App } from 'electron'

export default function handleUpdates(app: App) {
    const {logger} = useLogger({service: 'updater'})

    autoUpdater.logger = logger

    app.whenReady().then(async () =>
        await autoUpdater.checkForUpdatesAndNotify()
    )
}
