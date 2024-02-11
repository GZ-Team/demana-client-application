import { is } from '@electron-toolkit/utils'

export function getEnvironmentMode(): string {
    return import.meta.env.MODE
}

export function isLocal(): boolean {
    return is.dev
}

export function isDev(): boolean {
    return getEnvironmentMode() === 'development'
}
