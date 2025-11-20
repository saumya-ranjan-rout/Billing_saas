"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerController = void 0;
const express_validator_1 = require("express-validator");
const logger_1 = __importDefault(require("../utils/logger"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../entities/User");
const database_1 = require("../config/database");
function getErrorMessage(error) {
    if (error instanceof Error) {
        return error.message;
    }
    return String(error);
}
class CustomerController {
    constructor(customerService, cacheService, authService, userRepo = database_1.AppDataSource.getRepository(User_1.User)) {
        this.customerService = customerService;
        this.cacheService = cacheService;
        this.authService = authService;
        this.userRepo = userRepo;
        this.jwt = jsonwebtoken_1.default;
    }
    async createCustomer(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const tenantId = req.user.tenantId;
            const customerData = {
                ...req.body,
                status: 'Approved',
                billingAddress: req.body.address,
                shippingAddress: req.body.address,
            };
            delete customerData.address;
            const customer = await this.customerService.createCustomer(tenantId, customerData);
            await this.cacheService.invalidatePattern(`customers:${tenantId}:*`);
            await this.cacheService.invalidatePattern(`cache:${tenantId}:/api/customers*`);
            await this.cacheService.invalidatePattern(`dashboard:${tenantId}`);
            res.status(201).json(customer);
        }
        catch (error) {
            logger_1.default.error('Error creating customer:', error);
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }
    async getCustomer(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const { id } = req.params;
            const tenantId = req.user.tenantId;
            const cacheKey = `customer:${id}:${tenantId}`;
            const customer = await this.cacheService.getOrSet(cacheKey, async () => {
                return await this.customerService.getCustomer(tenantId, id);
            }, 300);
            if (!customer) {
                return res.status(404).json({ error: 'Customer not found' });
            }
            res.json(customer);
        }
        catch (error) {
            logger_1.default.error('Error fetching customer:', error);
            res.status(404).json({ error: getErrorMessage(error) });
        }
    }
    async getCustomers(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const tenantId = req.user.tenantId;
            const { page = 1, limit = 10, search } = req.query;
            const pageNum = Math.max(1, parseInt(page));
            const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
            const options = {
                page: pageNum,
                limit: limitNum,
                search: search
            };
            const cacheKey = `customers:${tenantId}:${JSON.stringify(options)}`;
            const customers = await this.cacheService.getOrSet(cacheKey, async () => {
                return await this.customerService.getCustomers(tenantId, options);
            }, 120);
            res.json(customers);
        }
        catch (error) {
            logger_1.default.error('Error fetching customers:', error);
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }
    async updateCustomer(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const { id } = req.params;
            const tenantId = req.user.tenantId;
            const updates = {
                ...req.body,
                billingAddress: req.body.address,
                shippingAddress: req.body.address,
            };
            delete updates.address;
            const customer = await this.customerService.updateCustomer(tenantId, id, updates);
            await this.cacheService.del(`customer:${id}:${tenantId}`);
            await this.cacheService.invalidatePattern(`customers:${tenantId}:*`);
            await this.cacheService.invalidatePattern(`cache:${tenantId}:/api/customers*`);
            res.json(customer);
        }
        catch (error) {
            logger_1.default.error('Error updating customer:', error);
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }
    async deleteCustomer(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const { id } = req.params;
            const tenantId = req.user.tenantId;
            await this.customerService.deleteCustomer(tenantId, id);
            await this.cacheService.del(`customer:${id}:${tenantId}`);
            await this.cacheService.invalidatePattern(`customers:${tenantId}:*`);
            await this.cacheService.invalidatePattern(`cache:${tenantId}:/api/customers*`);
            await this.cacheService.invalidatePattern(`dashboard:${tenantId}`);
            res.status(204).send();
        }
        catch (error) {
            logger_1.default.error('Error deleting customer:', error);
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }
    async searchCustomers(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const tenantId = req.user.tenantId;
            const { q } = req.query;
            if (!q || q.length < 2) {
                return res.status(400).json({ error: 'Search query must be at least 2 characters long' });
            }
            const cacheKey = `customers:search:${tenantId}:${q}`;
            const customers = await this.cacheService.getOrSet(cacheKey, async () => {
                return await this.customerService.searchCustomers(tenantId, q);
            }, 60);
            res.json(customers);
        }
        catch (error) {
            logger_1.default.error('Error searching customers:', error);
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }
    async getCustomersWithInvoices(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const tenantId = req.user.tenantId;
            const { page, limit } = req.query;
            const options = {
                page: parseInt(page) || 1,
                limit: parseInt(limit) || 10
            };
            const customers = await this.customerService.getCustomersWithInvoices(tenantId, options);
            res.json(customers);
        }
        catch (error) {
            logger_1.default.error('Error fetching customers with invoices:', error);
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }
    async updateUser(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const { tenantId } = req.params;
            const loggedtenantId = req.user.tenantId;
            const loggedId = req.user.id;
            const user = await this.customerService.updateUser(tenantId, loggedtenantId, loggedId);
            await this.cacheService.invalidatePattern(`*${loggedtenantId}*`);
            res.json({ success: true, user });
        }
        catch (error) {
            logger_1.default.error('Error updating user:', error);
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }
    async switchTenant(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            const { id, role } = req.params;
            const user = req.user;
            let resolvedRole;
            let tenantId;
            if (role === "professional_user") {
                resolvedRole = User_1.UserRole.PROFESSIONAL_USER;
                tenantId = id;
            }
            else {
                resolvedRole = User_1.UserRole.PROFESSIONAL;
                const loggedUser = await this.userRepo.findOne({
                    where: { id: user.id },
                    relations: ["tenant"],
                });
                if (!loggedUser || !loggedUser.tenant) {
                    return res.status(400).json({ error: "Tenant not found" });
                }
                tenantId = loggedUser.tenant.id;
            }
            const payload = {
                userId: user.id,
                tenantId,
                email: user.email,
                role: resolvedRole,
                permissions: [],
                firstName: user.firstName,
                lastName: user.lastName,
            };
            const result = await this.customerService.switchTenant(payload);
            return res.json({
                success: true,
                user: result.user,
                accessToken: result.accessToken,
                refreshToken: result.refreshToken,
            });
        }
        catch (error) {
            console.error("Login error:", error.message);
            return res.status(500).json({ error: error.message });
        }
    }
}
exports.CustomerController = CustomerController;
//# sourceMappingURL=CustomerController.js.map