"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.generateToken = exports.optionalAuth = exports.requireOwnershipOrRole = exports.requireRole = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const typeorm_1 = require("typeorm");
const User_1 = require("../entities/User");
const logger_1 = __importDefault(require("../utils/logger"));
function isJwtError(error) {
    return error && typeof error.name === 'string' && typeof error.message === 'string';
}
function isError(error) {
    return error instanceof Error;
}
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            logger_1.default.warn('Authentication attempt without token', {
                ip: req.ip,
                path: req.path,
                userAgent: req.get('User-Agent')
            });
            res.status(401).json({
                success: false,
                message: 'Access token required'
            });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const userRepository = (0, typeorm_1.getRepository)(User_1.User);
        const user = await userRepository.findOne({
            where: { id: decoded.id },
            relations: ['tenant']
        });
        if (!user) {
            logger_1.default.warn('Token valid but user not found', {
                userId: decoded.id,
                ip: req.ip
            });
            res.status(403).json({
                success: false,
                message: 'User no longer exists'
            });
            return;
        }
        if (!user.tenant.isActive) {
            logger_1.default.warn('User attempted to access inactive tenant', {
                userId: user.id,
                tenantId: user.tenant.id
            });
            res.status(403).json({
                success: false,
                message: 'Tenant account is inactive'
            });
            return;
        }
        req.user = {
            id: user.id,
            email: user.email,
            role: user.role,
            tenantId: user.tenant.id,
            firstName: user.firstName,
            lastName: user.lastName
        };
        logger_1.default.debug('User authenticated successfully', {
            userId: user.id,
            email: user.email,
            path: req.path
        });
        next();
    }
    catch (error) {
        if (isJwtError(error)) {
            if (error.name === 'TokenExpiredError') {
                logger_1.default.warn('Expired token attempted', {
                    ip: req.ip,
                    path: req.path
                });
                res.status(403).json({
                    success: false,
                    message: 'Token expired'
                });
                return;
            }
            else if (error.name === 'JsonWebTokenError') {
                logger_1.default.warn('Invalid token attempted', {
                    ip: req.ip,
                    path: req.path,
                    error: error.message
                });
                res.status(403).json({
                    success: false,
                    message: 'Invalid token'
                });
                return;
            }
        }
        logger_1.default.error('Authentication error', {
            error: isError(error) ? error.message : 'Unknown error',
            stack: isError(error) ? error.stack : undefined
        });
        res.status(500).json({
            success: false,
            message: 'Authentication failed'
        });
    }
};
exports.authenticateToken = authenticateToken;
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
            return;
        }
        const userRole = req.user.role;
        const allowedRoles = Array.isArray(roles) ? roles : [roles];
        if (!allowedRoles.includes(userRole)) {
            logger_1.default.warn('User attempted to access restricted resource', {
                userId: req.user.id,
                userRole,
                requiredRoles: allowedRoles,
                path: req.path
            });
            res.status(403).json({
                success: false,
                message: 'Insufficient permissions'
            });
            return;
        }
        next();
    };
};
exports.requireRole = requireRole;
const requireOwnershipOrRole = (resourceOwnerIdPath, roles = []) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
            return;
        }
        const allowedRoles = Array.isArray(roles) ? roles : [roles];
        if (allowedRoles.length > 0 && allowedRoles.includes(req.user.role)) {
            next();
            return;
        }
        try {
            const pathParts = resourceOwnerIdPath.split('.');
            let value = req;
            for (const part of pathParts) {
                value = value[part];
                if (value === undefined)
                    break;
            }
            const resourceOwnerId = value;
            if (resourceOwnerId && resourceOwnerId === req.user.id) {
                next();
                return;
            }
        }
        catch (error) {
            logger_1.default.error('Error checking resource ownership', {
                error: isError(error) ? error.message : 'Unknown error',
                path: resourceOwnerIdPath
            });
        }
        logger_1.default.warn('User attempted to access resource without ownership or proper role', {
            userId: req.user.id,
            userRole: req.user.role,
            requiredRoles: allowedRoles,
            path: req.path
        });
        res.status(403).json({
            success: false,
            message: 'Insufficient permissions'
        });
    };
};
exports.requireOwnershipOrRole = requireOwnershipOrRole;
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            next();
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const userRepository = (0, typeorm_1.getRepository)(User_1.User);
        const user = await userRepository.findOne({
            where: { id: decoded.id },
            relations: ['tenant']
        });
        if (user && user.tenant.isActive) {
            req.user = {
                id: user.id,
                email: user.email,
                role: user.role,
                tenantId: user.tenant.id,
                firstName: user.firstName,
                lastName: user.lastName
            };
        }
        next();
    }
    catch (error) {
        next();
    }
};
exports.optionalAuth = optionalAuth;
const generateToken = (user) => {
    return jsonwebtoken_1.default.sign({
        id: user.id,
        email: user.email,
        tenantId: user.tenant.id,
        role: user.role,
        permissions: user.permissions,
    }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '24h' });
};
exports.generateToken = generateToken;
const refreshToken = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
            return;
        }
        const userRepository = (0, typeorm_1.getRepository)(User_1.User);
        const user = await userRepository.findOne({
            where: { id: req.user.id },
            relations: ['tenant']
        });
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }
        const token = (0, exports.generateToken)(user);
        const { password: _, ...userWithoutPassword } = user;
        res.json({
            success: true,
            token,
            user: userWithoutPassword
        });
    }
    catch (error) {
        logger_1.default.error('Token refresh error', {
            error: isError(error) ? error.message : 'Unknown error',
            stack: isError(error) ? error.stack : undefined
        });
        res.status(500).json({
            success: false,
            message: 'Token refresh failed'
        });
    }
};
exports.refreshToken = refreshToken;
//# sourceMappingURL=auth.middleware.js.map