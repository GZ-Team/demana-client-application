import { app } from 'electron'
import { resolve } from 'path'

import { getFileContents, writeFileContents } from '../utils/fileUtils'

type StorageKeys = 'home' | 'appData' | 'userData' | 'sessionData' | 'temp' | 'exe' | 'module' | 'desktop' | 'documents' | 'downloads' | 'music' | 'pictures' | 'videos' | 'recent' | 'logs' | 'crashDumps'

type UserDataStorageFileNames = 'configuration.json'

type StorageFileNames = UserDataStorageFileNames

type UserDataStorageDataKeys = 'selectedPrinterId'

type StorageDataKeys = UserDataStorageDataKeys

export default class {

    constructor(private storageKey: StorageKeys, private storageFileName: StorageFileNames) { }

    private get storageFilePath() {
        return resolve(app.getPath(this.storageKey), this.storageFileName)
    }

    private get storageValue(): Record<string, any> {
        return getFileContents(this.storageFilePath, {})
    }

    private set storageValue(newStorageValue) {
        writeFileContents(this.storageFilePath, newStorageValue)
    }

    get(key: StorageDataKeys) {
        return this.storageValue[key]
    }

    set(key: StorageDataKeys, value: any) {
        this.storageValue = { ...this.storageValue, [key]: value }
    }
}