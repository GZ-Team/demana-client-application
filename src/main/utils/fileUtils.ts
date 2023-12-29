import { resolve } from 'path'
import { existsSync, readFileSync, writeFileSync } from 'fs'

export function getFile(filePath: string, defaultValue?: any): string {
    try {
        if (!existsSync(resolve(filePath))) {
            writeToFile(filePath, defaultValue || '')
        }

        return readFileSync(resolve(filePath), { encoding: 'utf8' })
    } catch (exception) {
        throw new Error(`Failed to get file with path: '${filePath}': ${exception}`)
    }
}

export function writeToFile(filePath: string, newFileContent: any): void {
    try {
        writeFileSync(resolve(filePath), JSON.stringify(newFileContent), { encoding: 'utf-8' })
    } catch (exception) {
        throw new Error(`Failed to write to file with path: '${filePath}': ${exception}`)
    }
}

export function getFileContents(filePath: string, defaultValue?: any): any {
    try {
        return JSON.parse(getFile(filePath, defaultValue))
    } catch (exception) {
        throw new Error(`Failed to get contents of file with path: '${filePath}': ${exception}`)
    }
}

export function writeFileContents(filePath: string, newFileContent: any) {
    try {
        console.log({ newFileContent })
        writeToFile(filePath, newFileContent)
    } catch (exception) {
        throw new Error(`Failed to write contents to file with path: '${filePath}': ${exception}`)
    }
}