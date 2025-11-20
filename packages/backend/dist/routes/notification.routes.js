"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notification_controller_1 = require("../controllers/notification.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const tenant_middleware_1 = require("../middleware/tenant.middleware");
const error_middleware_1 = require("../middleware/error.middleware");
const cache_1 = require("../middleware/cache");
const router = (0, express_1.Router)();
const notificationController = new notification_controller_1.NotificationController();
router.post('/register-token', auth_middleware_1.authenticateToken, tenant_middleware_1.validateTenantAccess, (0, error_middleware_1.asyncErrorHandler)(notificationController.registerPushToken));
router.post('/send', auth_middleware_1.authenticateToken, tenant_middleware_1.validateTenantAccess, (0, error_middleware_1.asyncErrorHandler)(notificationController.sendPushNotification));
router.get('/', auth_middleware_1.authenticateToken, tenant_middleware_1.validateTenantAccess, (0, cache_1.cacheMiddleware)('1m'), (0, error_middleware_1.asyncErrorHandler)(notificationController.getUserNotifications));
router.get('/unread', auth_middleware_1.authenticateToken, tenant_middleware_1.validateTenantAccess, (0, cache_1.cacheMiddleware)('30s'), (0, error_middleware_1.asyncErrorHandler)(notificationController.getUnreadCount));
router.put('/:id/read', auth_middleware_1.authenticateToken, tenant_middleware_1.validateTenantAccess, (0, error_middleware_1.asyncErrorHandler)(notificationController.markAsRead));
router.put('/read-all', auth_middleware_1.authenticateToken, tenant_middleware_1.validateTenantAccess, (0, error_middleware_1.asyncErrorHandler)(notificationController.markAllAsRead));
router.delete('/:id', auth_middleware_1.authenticateToken, tenant_middleware_1.validateTenantAccess, (0, error_middleware_1.asyncErrorHandler)(notificationController.deleteNotification));
exports.default = router;
//# sourceMappingURL=notification.routes.js.map