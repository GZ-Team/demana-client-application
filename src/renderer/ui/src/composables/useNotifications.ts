import { ref } from 'vue'

export type DemanaNotification = {
    message: string
    type: 'info' | 'success' | 'warning' | 'error'
}

const notifications = ref<DemanaNotification[]>([])

export default function useNotifications() {
    return notifications
}
