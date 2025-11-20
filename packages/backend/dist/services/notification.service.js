"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const typeorm_1 = require("typeorm");
const admin = __importStar(require("firebase-admin"));
const User_1 = require("../entities/User");
const Notification_1 = require("../entities/Notification");
class NotificationService {
    async registerPushToken(userId, token, platform) {
        const userRepository = (0, typeorm_1.getRepository)(User_1.User);
        await userRepository.update(userId, {
            pushToken: token
        });
    }
    async sendPushNotification(userId, title, body, data = {}) {
        const userRepository = (0, typeorm_1.getRepository)(User_1.User);
        const notificationRepository = (0, typeorm_1.getRepository)(Notification_1.Notification);
        const user = await userRepository.findOne({
            where: { id: userId }
        });
        if (!user || !user.pushToken) {
            throw new Error('User or push token not found');
        }
        try {
            const message = {
                token: user.pushToken,
                notification: {
                    title,
                    body
                },
                data,
                apns: {
                    payload: {
                        aps: {
                            sound: 'default',
                            badge: 1
                        }
                    }
                }
            };
            await admin.messaging().send(message);
            const notification = notificationRepository.create({
                title,
                body,
                data,
                user,
                type: data.type || 'general',
                priority: data.priority || 'normal'
            });
            await notificationRepository.save(notification);
        }
        catch (error) {
            console.error('Error sending push notification:', error);
            throw new Error('Failed to send push notification');
        }
    }
    async getUserNotifications(userId, page = 1, limit = 20) {
        const notificationRepository = (0, typeorm_1.getRepository)(Notification_1.Notification);
        const skip = (page - 1) * limit;
        const [notifications, total] = await notificationRepository.findAndCount({
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' },
            skip,
            take: limit
        });
        return {
            notifications,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        };
    }
    async getUnreadCount(userId) {
        const notificationRepository = (0, typeorm_1.getRepository)(Notification_1.Notification);
        return await notificationRepository.count({
            where: {
                user: { id: userId },
                isRead: false
            }
        });
    }
    async markAsRead(userId, notificationId) {
        const notificationRepository = (0, typeorm_1.getRepository)(Notification_1.Notification);
        const notification = await notificationRepository.findOne({
            where: {
                id: notificationId,
                user: { id: userId }
            }
        });
        if (!notification) {
            throw new Error('Notification not found');
        }
        await notificationRepository.update(notificationId, { isRead: true });
    }
    async markAllAsRead(userId) {
        const notificationRepository = (0, typeorm_1.getRepository)(Notification_1.Notification);
        await notificationRepository
            .createQueryBuilder()
            .update(Notification_1.Notification)
            .set({ isRead: true })
            .where('userId = :userId', { userId })
            .andWhere('isRead = :isRead', { isRead: false })
            .execute();
    }
    async deleteNotification(userId, notificationId) {
        const notificationRepository = (0, typeorm_1.getRepository)(Notification_1.Notification);
        const notification = await notificationRepository.findOne({
            where: {
                id: notificationId,
                user: { id: userId }
            }
        });
        if (!notification) {
            throw new Error('Notification not found');
        }
        await notificationRepository.delete(notificationId);
    }
    async sendInvoiceDueNotification(userId, invoiceId, invoiceNumber) {
        await this.sendPushNotification(userId, 'Invoice Due', `Invoice ${invoiceNumber} is due soon`, {
            type: 'invoice_due',
            invoiceId,
            priority: 'high'
        });
    }
    async sendPaymentReceivedNotification(userId, invoiceId, invoiceNumber, amount) {
        await this.sendPushNotification(userId, 'Payment Received', `Payment of $${amount} received for invoice ${invoiceNumber}`, {
            type: 'payment_received',
            invoiceId,
            priority: 'normal'
        });
    }
}
exports.NotificationService = NotificationService;
//# sourceMappingURL=notification.service.js.map