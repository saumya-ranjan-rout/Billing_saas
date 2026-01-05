"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const tenant_1 = require("../middleware/tenant");
const NotificationController_1 = require("../controllers/NotificationController");
const router = (0, express_1.Router)();
const controller = new NotificationController_1.NotificationController();
router.get("/notification-status", auth_1.authMiddleware, tenant_1.tenantMiddleware, controller.getNotificationStatus.bind(controller));
exports.default = router;
//# sourceMappingURL=notificationRoutes.js.map