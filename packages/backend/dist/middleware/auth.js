"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../entities/User");
const SuperAdmin_1 = require("../entities/SuperAdmin");
const database_1 = require("../config/database");
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = {
            id: decoded.sub || decoded.userId,
            email: decoded.email,
            tenantId: decoded.tenantId,
            role: decoded.role,
            firstName: decoded.firstName || null,
            lastName: decoded.lastName || null,
        };
        next();
    }
    catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};
exports.authMiddleware = authMiddleware;
const authenticateUser = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (decoded.superAdmin) {
            const superAdminRepository = database_1.AppDataSource.getRepository(SuperAdmin_1.SuperAdmin);
            const superAdmin = await superAdminRepository.findOne({
                where: { id: decoded.id, is_active: true },
            });
            if (!superAdmin) {
                return res.status(401).json({ message: 'Invalid token.' });
            }
            req.superAdmin = superAdmin;
        }
        else {
            const userRepository = database_1.AppDataSource.getRepository(User_1.User);
            const user = await userRepository.findOne({
                where: { id: decoded.id },
                relations: ['tenant', 'roles', 'roles.permissions'],
            });
            if (!user) {
                return res.status(401).json({ message: 'Invalid token.' });
            }
            req.user = user;
            req.tenant = user.tenant;
        }
        next();
    }
    catch (error) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};
exports.authenticateUser = authenticateUser;
//# sourceMappingURL=auth.js.map