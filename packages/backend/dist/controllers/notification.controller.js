"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const notification_service_1 = require("../services/notification.service");
class NotificationController {
    constructor() {
        this.registerPushToken = async (req, res) => {
            try {
                const userId = req.user.id;
                const { token, platform } = req.body;
                await this.notificationService.registerPushToken(userId, token, platform);
                res.json({ success: true, message: 'Push token registered successfully' });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to register push token'
                });
            }
        };
        this.sendPushNotification = async (req, res) => {
            try {
                if (!['admin', 'accountant'].includes(req.user.role)) {
                    res.status(403).json({
                        success: false,
                        message: 'Insufficient permissions'
                    });
                    return;
                }
                const { userId, title, body, data } = req.body;
                await this.notificationService.sendPushNotification(userId, title, body, data);
                res.json({ success: true, message: 'Notification sent successfully' });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to send notification'
                });
            }
        };
        this.getUserNotifications = async (req, res) => {
            try {
                const userId = req.user.id;
                const { page = 1, limit = 20 } = req.query;
                const notifications = await this.notificationService.getUserNotifications(userId, parseInt(page), parseInt(limit));
                res.json({ success: true, notifications });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to fetch notifications'
                });
            }
        };
        this.getUnreadCount = async (req, res) => {
            try {
                const userId = req.user.id;
                const count = await this.notificationService.getUnreadCount(userId);
                res.json({ success: true, count });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to fetch unread count'
                });
            }
        };
        this.markAsRead = async (req, res) => {
            try {
                const userId = req.user.id;
                const { id } = req.params;
                await this.notificationService.markAsRead(userId, id);
                res.json({ success: true, message: 'Notification marked as read' });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to mark notification as read'
                });
            }
        };
        this.markAllAsRead = async (req, res) => {
            try {
                const userId = req.user.id;
                await this.notificationService.markAllAsRead(userId);
                res.json({ success: true, message: 'All notifications marked as read' });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to mark notifications as read'
                });
            }
        };
        this.deleteNotification = async (req, res) => {
            try {
                const userId = req.user.id;
                const { id } = req.params;
                await this.notificationService.deleteNotification(userId, id);
                res.json({ success: true, message: 'Notification deleted successfully' });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to delete notification'
                });
            }
        };
        this.notificationService = new notification_service_1.NotificationService();
    }
}
exports.NotificationController = NotificationController;
//# sourceMappingURL=notification.controller.js.map