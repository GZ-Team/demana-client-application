import { getFileContents, resolveAppFilePath, writeFileContents } from '../utils/fileUtils'
import { cloneDeep, isNil } from '../utils/sharedUtils'
import useLogger from '../utils/loggerUtils'

import type { Logger } from 'winston'
import type { StorageKey } from '@root/types'
import type { DemanaService } from '../types'

type AppDataStorageFileNames = 'appData.json'
type UserDataStorageFileNames = 'configuration.json';
type TempStorageFileNames = 'temp.json';

type StorageFileNames = AppDataStorageFileNames | UserDataStorageFileNames | TempStorageFileNames;

type AppDataStorageDataKeys = 'id'
type UserDataStorageDataKeys = 'selectedPrinterId' | 'printingConfiguration' | 'preferences';
type TempStorageDataKeys = 'currentRouteName';

type StorageDataKeys = AppDataStorageDataKeys | UserDataStorageDataKeys | TempStorageDataKeys;

export default class StorageService implements DemanaService {
    private logger: Logger = useLogger({ service: 'StorageService' }).logger

    private storageKey: StorageKey
    private storageFileName: StorageFileNames

    constructor(storageKey: StorageKey, storageFileName: StorageFileNames) {
        this.storageKey = storageKey
        this.storageFileName = storageFileName
    }

    private get storageFilePath() {
        return resolveAppFilePath(this.storageKey, this.storageFileName)
    }

    private get storageValue(): Record<string, unknown> {
        return cloneDeep(getFileContents(this.storageFilePath, {}))
    }

    private set storageValue(newStorageValue) {
        writeFileContents(this.storageFilePath, newStorageValue)
    }

    get(key: StorageDataKeys) {
        return this.storageValue[key]
    }

    set(key: StorageDataKeys, value: unknown) {
        this.logger.info(
            `Writing the property "${key}" to the configuration file "${this.storageFilePath}".`
        )
        this.storageValue = { ...this.storageValue, [key]: value }
    }

    setDefaultValues(key: StorageDataKeys, defaultValue: unknown) {
        const existingValue = this.get(key)

        switch (typeof existingValue) {
        case 'string':
        case 'number':
        case 'bigint':
        case 'boolean':
            if (isNil(existingValue)) {
                this.set(key, defaultValue)
            }
            break

        case 'object':
            this.set(key, {
                ...(defaultValue as object),
                ...(existingValue as object)
            })
            break

        case null:
        case 'undefined':
            this.set(key, defaultValue)
            break
        }
    }
}
