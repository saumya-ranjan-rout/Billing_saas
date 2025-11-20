"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tenantMiddleware = void 0;
function tenantMiddleware(req, res, next) {
    try {
        const user = req.user;
        if (!user || !user.tenantId) {
            return res.status(400).json({ error: 'Tenant context missing' });
        }
        next();
    }
    catch (error) {
        res.status(400).json({ error: 'Tenant validation failed' });
    }
}
exports.tenantMiddleware = tenantMiddleware;
//# sourceMappingURL=tenant.js.map