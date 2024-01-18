import { app } from 'electron';
import { resolve } from 'path';

import { getFileContents, writeFileContents } from '../utils/fileUtils';
import { isNil } from '../utils/sharedUtils';

type StorageKeys =
  | 'home'
  | 'appData'
  | 'userData'
  | 'sessionData'
  | 'temp'
  | 'exe'
  | 'module'
  | 'desktop'
  | 'documents'
  | 'downloads'
  | 'music'
  | 'pictures'
  | 'videos'
  | 'recent'
  | 'logs'
  | 'crashDumps';

type UserDataStorageFileNames = 'configuration.json';

type StorageFileNames = UserDataStorageFileNames;

type UserDataStorageDataKeys = 'selectedPrinterId' | 'printingConfiguration';

type StorageDataKeys = UserDataStorageDataKeys;

export default class {
  constructor(private storageKey: StorageKeys, private storageFileName: StorageFileNames) { }

  private get storageFilePath() {
    return resolve(app.getPath(this.storageKey), this.storageFileName);
  }

  private get storageValue(): Record<string, unknown> {
    return getFileContents(this.storageFilePath, {});
  }

  private set storageValue(newStorageValue) {
    writeFileContents(this.storageFilePath, newStorageValue);
  }

  get(key: StorageDataKeys) {
    return this.storageValue[key];
  }

  set(key: StorageDataKeys, value: unknown) {
    this.storageValue = { ...this.storageValue, [key]: value };
  }

  setDefaultValues(key: StorageDataKeys, defaultValue: unknown) {
    const existingValue = this.get(key)

    switch (typeof existingValue) {
      case 'string':
      case 'number':
      case 'bigint':
      case 'boolean':
        if (isNil(existingValue)) {
          console.log(`[storageService:setDefaultValues] Writing the property "${key}" to the configuration "${this.storageFilePath}".`)
          this.set(key, defaultValue)
        }
        break

      case 'object':
        console.log(`[storageService:setDefaultValueset] Writing the property "${key}" to the configuration "${this.storageFilePath}".`)
        this.set(key, {
          ...defaultValue as object,
          ...existingValue
        })
        break

      case 'undefined':
        console.log(`[storageService:setDefaultValues] Writing the property "${key}" to the configuration "${this.storageFilePath}".`)
        this.set(key, defaultValue)
        break;
    }
  }
}
