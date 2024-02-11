export function isNil(value: any): boolean {
    return [null, undefined].includes(value)
}

export function cloneDeep(value: any): any {
    return JSON.parse(JSON.stringify(value))
}
