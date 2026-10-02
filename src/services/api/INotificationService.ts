import { AppNotification } from '../../types';

export interface INotificationService {
  getNotifications(userId: string): Promise<AppNotification[]>;
  markAsRead(notificationId: string): Promise<void>;
  markAllAsRead(userId: string): Promise<void>;
  sendNotification(notification: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>): Promise<AppNotification>;
  subscribeToNotifications(userId: string, callback: (notification: AppNotification) => void): () => void;
}
