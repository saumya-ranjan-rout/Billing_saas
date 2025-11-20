"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const express_validator_1 = require("express-validator");
const logger_1 = __importDefault(require("../utils/logger"));
function getErrorMessage(error) {
    if (error instanceof Error)
        return error.message;
    return String(error);
}
class UserController {
    constructor(userService, cacheService) {
        this.userService = userService;
        this.cacheService = cacheService;
    }
    async createUser(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty())
                return res.status(400).json({ errors: errors.array() });
            if (!req.user)
                return res.status(401).json({ error: "Unauthorized" });
            const tenantId = req.user.tenantId;
            const userData = req.body;
            const user = await this.userService.createUser(tenantId, userData);
            await this.cacheService.invalidatePattern(`users:${tenantId}:*`);
            res.status(201).json(user);
        }
        catch (error) {
            logger_1.default.error("Error creating user:", error);
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }
    async getUser(req, res) {
        try {
            if (!req.user)
                return res.status(401).json({ error: "Unauthorized" });
            const tenantId = req.user.tenantId;
            const { id } = req.params;
            const cacheKey = `user:${tenantId}:${id}`;
            const user = await this.cacheService.getOrSet(cacheKey, async () => {
                return await this.userService.getUser(tenantId, id);
            }, 300);
            if (!user)
                return res.status(404).json({ error: "User not found" });
            res.json(user);
        }
        catch (error) {
            logger_1.default.error("Error fetching user:", error);
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }
    async getUsers(req, res) {
        try {
            if (!req.user)
                return res.status(401).json({ error: "Unauthorized" });
            const tenantId = req.user.tenantId;
            const { page = 1, limit = 10, search } = req.query;
            const pageNum = Math.max(1, parseInt(page));
            const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
            const options = { page: pageNum, limit: limitNum, search: search };
            const cacheKey = `users:${tenantId}:${JSON.stringify(options)}`;
            const users = await this.cacheService.getOrSet(cacheKey, async () => {
                return await this.userService.getUsers(tenantId, options);
            }, 120);
            res.json(users);
        }
        catch (error) {
            logger_1.default.error("Error fetching users:", error);
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }
    async updateUser(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty())
                return res.status(400).json({ errors: errors.array() });
            if (!req.user)
                return res.status(401).json({ error: "Unauthorized" });
            const { id } = req.params;
            const tenantId = req.user.tenantId;
            const updates = req.body;
            const updatedUser = await this.userService.updateUser(tenantId, id, updates);
            await this.cacheService.del(`user:${tenantId}:${id}`);
            await this.cacheService.invalidatePattern(`users:${tenantId}:*`);
            res.json(updatedUser);
        }
        catch (error) {
            logger_1.default.error("Error updating user:", error);
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }
    async deleteUser(req, res) {
        try {
            if (!req.user)
                return res.status(401).json({ error: "Unauthorized" });
            const { id } = req.params;
            const tenantId = req.user.tenantId;
            await this.userService.deleteUser(tenantId, id);
            await this.cacheService.del(`user:${tenantId}:${id}`);
            await this.cacheService.invalidatePattern(`users:${tenantId}:*`);
            res.status(204).send();
        }
        catch (error) {
            logger_1.default.error("Error deleting user:", error);
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }
    async resetPassword(req, res) {
        try {
            if (!req.user || req.user.role !== "admin") {
                return res.status(403).json({ error: "Forbidden. Admin access only." });
            }
            const { id } = req.params;
            const { newPassword } = req.body;
            const tenantId = req.user.tenantId;
            if (!newPassword || newPassword.length < 6) {
                return res.status(400).json({ error: "Password must be at least 6 characters long." });
            }
            const result = await this.userService.resetPassword(tenantId, id, newPassword);
            await this.cacheService.del(`user:${tenantId}:${id}`);
            res.json({ message: "Password updated successfully", userId: result.id });
        }
        catch (error) {
            logger_1.default.error("Error resetting password:", error);
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }
}
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map