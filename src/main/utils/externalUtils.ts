import { shell } from 'electron'

export async function openExternalLink(link: string): Promise<void> {
    return shell.openExternal(link)
}
