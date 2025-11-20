"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearTenantCache = void 0;
const database_1 = require("../config/database");
async function clearTenantCache(tenantId, routePrefix) {
    const pattern = `cache:${tenantId}:${routePrefix}*`;
    try {
        const keys = await database_1.redisClient.keys(pattern);
        if (keys.length > 0) {
            await database_1.redisClient.del(keys);
            console.log(`🧹 Cleared ${keys.length} cache keys for ${tenantId} - ${routePrefix}`);
        }
    }
    catch (err) {
        console.error('Error clearing cache:', err);
    }
}
exports.clearTenantCache = clearTenantCache;
//# sourceMappingURL=cacheUtils.js.map