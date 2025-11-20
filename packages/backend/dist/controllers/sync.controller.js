"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncController = void 0;
const sync_service_1 = require("../services/sync.service");
class SyncController {
    constructor() {
        this.syncData = async (req, res) => {
            try {
                const userId = req.user.id;
                const tenantId = req.user.tenantId;
                const { entities } = req.body;
                const result = await this.syncService.syncData(tenantId, userId, entities);
                res.json({ success: true, result });
            }
            catch (err) {
                const error = err instanceof Error ? err : new Error(String(err));
                res.status(500).json({
                    success: false,
                    message: 'Sync failed',
                    error: error.message
                });
            }
        };
        this.getUpdates = async (req, res) => {
            try {
                const tenantId = req.user.tenantId;
                const { lastSync } = req.query;
                const updates = await this.syncService.getUpdatesSince(tenantId, new Date(lastSync));
                res.json({ success: true, updates });
            }
            catch (err) {
                const error = err instanceof Error ? err : new Error(String(err));
                res.status(500).json({
                    success: false,
                    message: 'Failed to get updates',
                    error: error.message
                });
            }
        };
        this.syncService = new sync_service_1.SyncService();
    }
}
exports.SyncController = SyncController;
//# sourceMappingURL=sync.controller.js.map