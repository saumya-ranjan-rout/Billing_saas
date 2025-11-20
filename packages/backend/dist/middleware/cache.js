"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheMiddleware = void 0;
const database_1 = require("../config/database");
const ms_1 = __importDefault(require("ms"));
function cacheMiddleware(duration) {
    const ttlMs = (0, ms_1.default)(duration);
    if (typeof ttlMs !== 'number') {
        throw new Error(`Invalid cache duration: ${duration}`);
    }
    const ttlSeconds = Math.floor(ttlMs / 1000);
    const allowlist = [
        '/api/products',
        '/api/vendors',
        '/api/categories',
        '/api/customers',
        '/api/invoices',
        '/api/taxes',
        '/api/income-heads',
        '/api/settings/public',
    ];
    return async (req, res, next) => {
        try {
            const acceptHeader = req.headers.accept || '';
            if (req.method !== 'GET' ||
                acceptHeader.includes('text/html') ||
                req.originalUrl.startsWith('/auth') ||
                req.originalUrl.startsWith('/app') ||
                req.originalUrl.startsWith('/api/dashboard') ||
                req.originalUrl.startsWith('/api/profile') ||
                req.originalUrl.includes('session') ||
                !allowlist.some(route => req.originalUrl.startsWith(route))) {
                return next();
            }
            const tenantId = req.user?.tenantId || 'public';
            const key = `cache:${tenantId}:${req.originalUrl}`;
            const cached = await database_1.redisClient.get(key);
            if (cached) {
                res.setHeader('X-Cache', 'HIT');
                return res.json(JSON.parse(cached));
            }
            const originalJson = res.json.bind(res);
            res.json = (body) => {
                if (res.statusCode === 200) {
                    database_1.redisClient.setex(key, ttlSeconds, JSON.stringify(body));
                }
                res.setHeader('X-Cache', 'MISS');
                return originalJson(body);
            };
            next();
        }
        catch (err) {
            console.error('Cache middleware error:', err);
            next();
        }
    };
}
exports.cacheMiddleware = cacheMiddleware;
//# sourceMappingURL=cache.js.map