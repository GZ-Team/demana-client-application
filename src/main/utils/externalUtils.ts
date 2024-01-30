import { shell } from 'electron';

export function openExternalLink(link: string): Promise<void> {
  return shell.openExternal(link);
}
