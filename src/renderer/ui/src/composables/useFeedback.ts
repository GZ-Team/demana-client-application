import useNotifications from '@ui/composables/useNotifications'

import type { DemanaApiRequestFeedback } from '@ui/utils/graphQlUtils'
import type { DemanaNotification } from '@ui/composables/useNotifications'

export default function useFeedback(feedback?: DemanaApiRequestFeedback<unknown>) {
    const notifications = useNotifications()

    if (feedback) {
        addNotification(feedback)
    }

    function addNotification(feedback: DemanaApiRequestFeedback<unknown>) {
        const { success, message } = feedback

        const type: DemanaNotification['type'] = success ? 'success' : 'error'

        notifications.value.push({
            type: type,
            message: message ? `globals.notifications.${message}` : `globals.notifications.${type}.default`
        })
    }

    function clearNotifications(): void {
        notifications.value = []
    }

    return {
        clearNotifications
    }
}
