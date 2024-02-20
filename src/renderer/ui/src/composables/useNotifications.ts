import { ref } from 'vue'

export type DemanaNotification = {
    message: string
    type: 'info' | 'success' | 'warning' | 'error'
}

type DemanaNotificationOptions = {
    timeout?: number,
    persistent: boolean
}

const notifications = ref<DemanaNotification[]>([])

export default function useNotifications() {
    function createNotification(notification: DemanaNotification, options?: DemanaNotificationOptions): number {
        const notificationIndex = notifications.value.push(notification) - 1

        if (!options?.persistent) {
            setTimeout(() => notifications.value.splice(notificationIndex, 1), (options?.timeout || 5) * 1000)
        }

        return notificationIndex
    }

    function deleteNotification(notificationIndex: number) {
        notifications.value.splice(notificationIndex, 1)
    }

    function clearNotifications(): void {
        notifications.value = []
    }

    return {
        createNotification,
        deleteNotification,
        clearNotifications,
        notifications
    }
}
