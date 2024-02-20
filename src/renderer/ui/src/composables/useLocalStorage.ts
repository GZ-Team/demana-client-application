export default function useLocalStorage() {
    function removeItem(key: string): void {
        window.localStorage.removeItem(key)
    }

    function setItem(key: string, value: string): void {
        window.localStorage.setItem(key, value)
    }

    function getItem(key: string): string | null {
        return window.localStorage.getItem(key)
    }

    function getItems(keys: string[]): (string | null)[] {
        return keys.map(key => getItem(key))
    }

    return {
        removeItem,
        setItem,
        getItem,
        getItems
    }
}
