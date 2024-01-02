import { Tray, Menu, nativeImage } from "electron";

import type { NativeImage, MenuItemConstructorOptions, MenuItem } from 'electron'

export type TrayServiceOptions = {
    icon: string
    contextToolTip?: string
    contextMenuContent?: (MenuItemConstructorOptions | MenuItem)[]
}

export default class {
    private icon: string;
    private contextToolTip: string;
    private contextMenuContent: (MenuItemConstructorOptions | MenuItem)[];

    constructor(options: TrayServiceOptions) {
        this.icon = options.icon
        this.contextToolTip = options.contextToolTip || "Demana Client Application"
        this.contextMenuContent = options.contextMenuContent || []
    }

    get trayIcon(): NativeImage {
        return nativeImage.createFromDataURL(this.icon)
    }

    get contextMenu(): Menu {
        return Menu.buildFromTemplate(this.contextMenuContent)
    }

    buildTrayContextMenu(): Tray {
        const tray = new Tray(this.trayIcon)

        tray.setToolTip(this.contextToolTip)
        tray.setContextMenu(this.contextMenu)

        return tray
    }
}