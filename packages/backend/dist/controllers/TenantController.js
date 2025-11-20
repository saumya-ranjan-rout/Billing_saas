"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantController = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
function getErrorMessage(error) {
    return error instanceof Error ? error.message : String(error);
}
class TenantController {
    constructor(tenantService, provisioningService, cacheService) {
        this.tenantService = tenantService;
        this.provisioningService = provisioningService;
        this.cacheService = cacheService;
    }
    async createTenant(req, res) {
        try {
            const { name, email, password, businessName } = req.body;
            const { tenant, adminUser } = await this.provisioningService.provisionNewTenant({ name, businessName }, { email, password });
            await this.cacheService.del(`tenant:${tenant.id}`);
            res.status(201).json({ tenant, adminUser });
        }
        catch (error) {
            logger_1.default.error("Error creating tenant:", { error });
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }
    async getTenantDetails(req, res) {
        const tenantId = req.user?.tenantId;
        if (!tenantId) {
            res.status(401).json({ error: "Unauthorized: No tenant found" });
            return;
        }
        try {
            const cacheKey = `tenant:${tenantId}`;
            const cachedTenant = await this.cacheService.get(cacheKey);
            if (cachedTenant) {
                logger_1.default.debug("Tenant details served from cache", { tenantId });
                res.json({ ...JSON.parse(cachedTenant), cached: true });
                return;
            }
            const tenant = await this.tenantService.getTenantById(tenantId);
            if (!tenant) {
                res.status(404).json({ error: "Tenant not found" });
                return;
            }
            await this.cacheService.set(cacheKey, JSON.stringify(tenant), 60 * 5);
            res.json({ ...tenant, cached: false });
        }
        catch (error) {
            logger_1.default.error("Error fetching tenant details:", { tenantId, error });
            res.status(404).json({ error: getErrorMessage(error) });
        }
    }
    async updateTenant(req, res) {
        const tenantId = req.user?.tenantId;
        if (!tenantId) {
            res.status(401).json({ error: "Unauthorized: No tenant found" });
            return;
        }
        try {
            const updates = req.body;
            const updatedTenant = await this.tenantService.updateTenant(tenantId, updates);
            await this.cacheService.del(`tenant:${tenantId}`);
            res.json(updatedTenant);
        }
        catch (error) {
            logger_1.default.error("Error updating tenant:", { tenantId, error });
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }
}
exports.TenantController = TenantController;
//# sourceMappingURL=TenantController.js.map