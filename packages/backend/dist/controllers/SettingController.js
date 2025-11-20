"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingController = void 0;
const SettingService_1 = require("../services/SettingService");
const service = new SettingService_1.SettingService();
class SettingController {
    async get(req, res) {
        if (!req.user)
            return res.status(401).json({ error: "Unauthorized" });
        const tenantId = req.user.tenantId;
        const settings = await service.getByTenant(tenantId);
        res.json(settings);
    }
    async update(req, res) {
        if (!req.user)
            return res.status(401).json({ error: "Unauthorized" });
        const tenantId = req.user.tenantId;
        const updated = await service.update(tenantId, req.body);
        res.json(updated);
    }
}
exports.SettingController = SettingController;
//# sourceMappingURL=SettingController.js.map