import useNotifications from '@ui/composables/useNotifications'

import type { DemanaApiRequestFeedback } from '@ui/utils/graphQlUtils'
import type { DemanaNotification } from '@ui/composables/useNotifications'

export default function useFeedback(feedback?: DemanaApiRequestFeedback<unknown>) {
    const { createNotification } = useNotifications()

    if (feedback) {
        addNotification(feedback)
    }

    function addNotification(feedback: DemanaApiRequestFeedback<unknown>) {
        const { success, message } = feedback

        const type: DemanaNotification['type'] = success ? 'success' : 'error'

        createNotification({
            type: type,
            message: message ? `globals.notifications.${message}` : `globals.notifications.${type}.default`
        })
    }
}
