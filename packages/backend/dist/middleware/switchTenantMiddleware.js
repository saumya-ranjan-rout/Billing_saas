"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.switchTenantMiddleware = void 0;
const database_1 = require("../config/database");
const Tenant_1 = require("../entities/Tenant");
const switchTenantMiddleware = async (req, res, next) => {
    try {
        const newTenantId = req.params.tenantId;
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const tenantRepo = database_1.AppDataSource.getRepository(Tenant_1.Tenant);
        const exists = await tenantRepo.findOne({ where: { id: newTenantId } });
        if (!exists) {
            return res.status(400).json({ error: "Invalid tenant selected" });
        }
        req.user.tenantId = newTenantId;
        req.user.role = "admin";
        next();
    }
    catch (err) {
        res.status(500).json({ error: "Cannot switch tenant" });
    }
};
exports.switchTenantMiddleware = switchTenantMiddleware;
//# sourceMappingURL=switchTenantMiddleware.js.map