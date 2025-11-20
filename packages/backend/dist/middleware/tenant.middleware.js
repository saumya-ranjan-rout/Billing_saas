"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTenantUser = exports.validateTenantResource = exports.requireTenantAdmin = exports.resolveTenantFromSubdomain = exports.extractTenantFromSubdomain = exports.validateTenantAccess = void 0;
const typeorm_1 = require("typeorm");
const Tenant_1 = require("../entities/Tenant");
const User_1 = require("../entities/User");
const logger_1 = __importDefault(require("../utils/logger"));
const getUserId = (req) => {
    return req.user?.id || null;
};
const getUserTenantId = (req) => {
    return req.user?.tenantId || null;
};
const validateTenantAccess = async (req, res, next) => {
    try {
        const userId = getUserId(req);
        const tenantId = getUserTenantId(req);
        if (!userId || !tenantId) {
            res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
            return;
        }
        const tenantRepository = (0, typeorm_1.getRepository)(Tenant_1.Tenant);
        const tenant = await tenantRepository.findOne({
            where: { id: tenantId }
        });
        if (!tenant) {
            logger_1.default.error('User tenant not found', {
                userId,
                tenantId
            });
            res.status(403).json({
                success: false,
                message: 'Tenant not found'
            });
            return;
        }
        if (!tenant.isActive) {
            logger_1.default.warn('User attempted to access inactive tenant', {
                userId,
                tenantId
            });
            res.status(403).json({
                success: false,
                message: 'Tenant account is inactive'
            });
            return;
        }
        req.tenant = tenant;
        logger_1.default.debug('Tenant access validated', {
            userId,
            tenantId,
            tenantName: tenant.name
        });
        next();
    }
    catch (error) {
        logger_1.default.error('Tenant validation error', {
            error: error.message,
            stack: error.stack
        });
        res.status(500).json({
            success: false,
            message: 'Tenant validation failed'
        });
    }
};
exports.validateTenantAccess = validateTenantAccess;
const extractTenantFromSubdomain = (req, res, next) => {
    try {
        const host = req.get('host');
        const subdomain = host?.split('.')[0];
        if (subdomain && subdomain !== 'www' && subdomain !== 'api') {
            req.tenantSubdomain = subdomain;
            logger_1.default.debug('Extracted tenant subdomain', { subdomain });
        }
        next();
    }
    catch (error) {
        logger_1.default.error('Subdomain extraction error', {
            error: error.message,
            stack: error.stack
        });
        next();
    }
};
exports.extractTenantFromSubdomain = extractTenantFromSubdomain;
const resolveTenantFromSubdomain = async (req, res, next) => {
    try {
        const tenantSubdomain = req.tenantSubdomain;
        if (!tenantSubdomain) {
            next();
            return;
        }
        const tenantRepository = (0, typeorm_1.getRepository)(Tenant_1.Tenant);
        const tenant = await tenantRepository.findOne({
            where: { subdomain: tenantSubdomain }
        });
        if (tenant && tenant.isActive) {
            req.tenant = tenant;
            logger_1.default.debug('Resolved tenant from subdomain', {
                subdomain: tenantSubdomain,
                tenantId: tenant.id
            });
        }
        else {
            logger_1.default.warn('Invalid or inactive tenant subdomain', {
                subdomain: tenantSubdomain
            });
        }
        next();
    }
    catch (error) {
        logger_1.default.error('Tenant resolution error', {
            error: error.message,
            stack: error.stack
        });
        next();
    }
};
exports.resolveTenantFromSubdomain = resolveTenantFromSubdomain;
const requireTenantAdmin = (req, res, next) => {
    const userId = getUserId(req);
    const userRole = req.user?.role;
    if (!userId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
        return;
    }
    if (userRole !== 'admin') {
        logger_1.default.warn('Non-admin user attempted tenant admin operation', {
            userId,
            userRole,
            path: req.path
        });
        res.status(403).json({
            success: false,
            message: 'Tenant admin role required'
        });
        return;
    }
    next();
};
exports.requireTenantAdmin = requireTenantAdmin;
const validateTenantResource = (resourceType, idParam = 'id') => {
    return async (req, res, next) => {
        try {
            const userId = getUserId(req);
            const tenantId = getUserTenantId(req);
            if (!userId || !tenantId) {
                res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
                return;
            }
            const resourceId = req.params[idParam];
            if (!resourceId) {
                res.status(400).json({
                    success: false,
                    message: 'Resource ID is required'
                });
                return;
            }
            const repository = (0, typeorm_1.getRepository)(resourceType);
            const resource = await repository.findOne({
                where: { id: resourceId },
                relations: ['tenant']
            });
            if (!resource) {
                res.status(404).json({
                    success: false,
                    message: 'Resource not found'
                });
                return;
            }
            if (resource.tenant.id !== tenantId) {
                logger_1.default.warn('User attempted to access resource from another tenant', {
                    userId,
                    userTenantId: tenantId,
                    resourceTenantId: resource.tenant.id,
                    resourceId,
                    resourceType,
                    path: req.path
                });
                res.status(403).json({
                    success: false,
                    message: 'Access to resource denied'
                });
                return;
            }
            req[resourceType] = resource;
            next();
        }
        catch (error) {
            logger_1.default.error('Tenant resource validation error', {
                error: error.message,
                stack: error.stack,
                resourceType
            });
            res.status(500).json({
                success: false,
                message: 'Resource validation failed'
            });
        }
    };
};
exports.validateTenantResource = validateTenantResource;
const validateTenantUser = async (req, res, next) => {
    try {
        const userId = getUserId(req);
        const tenantId = getUserTenantId(req);
        if (!userId || !tenantId) {
            res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
            return;
        }
        const targetUserId = req.params.userId;
        if (!targetUserId) {
            next();
            return;
        }
        if (targetUserId === userId) {
            next();
            return;
        }
        const userRepository = (0, typeorm_1.getRepository)(User_1.User);
        const targetUser = await userRepository.findOne({
            where: { id: targetUserId },
            relations: ['tenant']
        });
        if (!targetUser) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }
        if (targetUser.tenant.id !== tenantId) {
            logger_1.default.warn('User attempted to access user from another tenant', {
                userId,
                userTenantId: tenantId,
                targetUserId,
                targetUserTenantId: targetUser.tenant.id,
                path: req.path
            });
            res.status(403).json({
                success: false,
                message: 'Access to user denied'
            });
            return;
        }
        next();
    }
    catch (error) {
        logger_1.default.error('Tenant user validation error', {
            error: error.message,
            stack: error.stack
        });
        res.status(500).json({
            success: false,
            message: 'User validation failed'
        });
    }
};
exports.validateTenantUser = validateTenantUser;
//# sourceMappingURL=tenant.middleware.js.map