import { Notification } from 'electron'

import type { NativeImage } from 'electron'
import type { DemanaService } from '../types'

export type DemanaNotificationOptions = {
  title: string;
  message: string;
  icon?: NativeImage;
};

export default class NotificationService implements DemanaService {
    private defaultIcon: string

    constructor(defaultIcon: NativeImage) {
        this.defaultIcon = defaultIcon.toDataURL()
    }

    showNotification(options: DemanaNotificationOptions): void {
        const { title, message, icon } = options

        new Notification({
            title,
            body: message,
            icon: icon ? icon.toDataURL() : this.defaultIcon
        }).show()
    }
}
