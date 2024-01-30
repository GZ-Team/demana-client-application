import { NativeImage, Notification } from 'electron';

export type DemanaNotificationOptions = {
  title: string;
  message: string;
  icon?: NativeImage;
};

export default class NotificationService {
  private defaultIcon: string;

  constructor(defaultIcon: NativeImage) {
    this.defaultIcon = defaultIcon.toDataURL();
  }

  showNotification(options: DemanaNotificationOptions): void {
    const { title, message, icon } = options;

    new Notification({
      title,
      body: message,
      icon: icon ? icon.toDataURL() : this.defaultIcon
    }).show();
  }
}
