import { BrowserWindow } from "electron"

import type { WebContents } from "electron"

export function getBrowserWindowByProcessId(processId: number): BrowserWindow {
    const process = BrowserWindow.fromId(processId)

    if (!process) {
        throw new Error(`the process for process id "${processId}" was not found.`)
    }

    return process
}

export function getBrowserWindowByProcessWebContents(processWebContents: WebContents): BrowserWindow {
    const process = BrowserWindow.fromWebContents(processWebContents)

    if (!process) {
        throw new Error(`the process for the provided WebContents with id "${processWebContents.id}" was not found.`)
    }

    return process
}