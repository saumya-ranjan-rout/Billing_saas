"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
function getErrorMessage(error) {
    return error instanceof Error ? error.message : String(error);
}
class DashboardController {
    constructor(dashboardService, cacheService) {
        this.dashboardService = dashboardService;
        this.cacheService = cacheService;
    }
    async getDashboardData(req, res) {
        const startTime = Date.now();
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const tenantId = req.user.tenantId;
        const cacheKey = `dashboard:${tenantId}`;
        try {
            const cachedData = await this.cacheService.get(cacheKey);
            if (cachedData) {
                const duration = Date.now() - startTime;
                logger_1.default.debug(`Dashboard data served from cache in ${duration}ms`, { tenantId, duration });
                res.json({ ...cachedData, cached: true });
                return;
            }
            const dashboardData = await this.dashboardService.getDashboardData(tenantId);
            await this.cacheService.set(cacheKey, JSON.stringify(dashboardData), 60 * 2);
            const duration = Date.now() - startTime;
            logger_1.default.debug(`Dashboard data fetched in ${duration}ms`, { tenantId, duration });
            res.json({ ...dashboardData, cached: false });
        }
        catch (error) {
            logger_1.default.error('Error fetching dashboard data:', { tenantId, error });
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }
    async refreshDashboard(req, res) {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const tenantId = req.user.tenantId;
        const cacheKey = `dashboard:${tenantId}`;
        try {
            await this.cacheService.del(cacheKey);
            const dashboardData = await this.dashboardService.getDashboardData(tenantId);
            await this.cacheService.set(cacheKey, JSON.stringify(dashboardData), 60 * 2);
            res.json({
                ...dashboardData,
                cached: false,
                refreshedAt: new Date().toISOString(),
            });
        }
        catch (error) {
            logger_1.default.error('Error refreshing dashboard:', { tenantId, error });
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }
}
exports.DashboardController = DashboardController;
//# sourceMappingURL=DashboardController.js.map