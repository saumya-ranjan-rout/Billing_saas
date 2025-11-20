import { Notification } from '../entities/Notification';
export declare class NotificationService {
    registerPushToken(userId: string, token: string, platform: string): Promise<void>;
    sendPushNotification(userId: string, title: string, body: string, data?: any): Promise<void>;
    getUserNotifications(userId: string, page?: number, limit?: number): Promise<{
        notifications: Notification[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    getUnreadCount(userId: string): Promise<number>;
    markAsRead(userId: string, notificationId: string): Promise<void>;
    markAllAsRead(userId: string): Promise<void>;
    deleteNotification(userId: string, notificationId: string): Promise<void>;
    sendInvoiceDueNotification(userId: string, invoiceId: string, invoiceNumber: string): Promise<void>;
    sendPaymentReceivedNotification(userId: string, invoiceId: string, invoiceNumber: string, amount: number): Promise<void>;
}
//# sourceMappingURL=notification.service.d.ts.map