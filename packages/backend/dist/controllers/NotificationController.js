"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const NotificationService_1 = require("../services/NotificationService");
class NotificationController {
    constructor() {
        this.notificationService = new NotificationService_1.NotificationService();
    }
    async getNotificationStatus(req, res) {
        try {
            const userId = req.user?.id;
            const tenantId = req.user?.tenantId;
            if (!userId || !tenantId) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const data = await this.notificationService.getNotificationStatus(userId, tenantId);
            res.json(data);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}
exports.NotificationController = NotificationController;
//# sourceMappingURL=NotificationController.js.map