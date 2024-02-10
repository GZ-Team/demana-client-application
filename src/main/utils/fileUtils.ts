import { app } from 'electron';
import { resolve, parse, dirname } from 'path';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';

import { isLocal } from './environmentUtils';

import type { StorageKey } from '@root/types';

export function resolveAppFilePath(storageKey: StorageKey, ...pathPartials: string[]): string {
  return isLocal()
    ? resolve(dirname(dirname(process.argv[1])), '.output', storageKey, ...pathPartials)
    : resolve(app.getPath(storageKey), ...pathPartials);
}

export function getFile(filePath: string): string {
  try {
    if (!existsSync(resolve(filePath))) {
      createFile(filePath);
    }

    return readFileSync(resolve(filePath), { encoding: 'utf8' });
  } catch (exception) {
    throw new Error(`Failed to get file with path: '${filePath}': ${exception}`);
  }
}

export function createFile(filePath: string): void {
  try {
    const { dir } = parse(filePath);

    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    writeToFile(filePath, '');
  } catch (exception) {
    throw new Error(`Failed to create a file with path: '${filePath}': ${exception}`);
  }
}

export function writeToFile(filePath: string, newFileContent: any): void {
  try {
    writeFileSync(resolve(filePath), JSON.stringify(newFileContent, null, 2), {
      encoding: 'utf-8'
    });
  } catch (exception) {
    throw new Error(`Failed to write to file with path: '${filePath}': ${exception}`);
  }
}

export function getFileContents(filePath: string, defaultValue: any = null): any {
  try {
    const fileContents = getFile(filePath);
    return fileContents ? JSON.parse(getFile(filePath)) : defaultValue;
  } catch (exception) {
    throw new Error(`Failed to get contents of file with path: '${filePath}': ${exception}`);
  }
}

export function writeFileContents(filePath: string, newFileContent: any) {
  try {
    writeToFile(filePath, newFileContent);
  } catch (exception) {
    throw new Error(`Failed to write contents to file with path: '${filePath}': ${exception}`);
  }
}
