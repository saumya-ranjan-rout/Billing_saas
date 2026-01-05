"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorController = void 0;
const express_validator_1 = require("express-validator");
const logger_1 = __importDefault(require("../utils/logger"));
function getErrorMessage(error) {
    if (error instanceof Error) {
        return error.message;
    }
    return String(error);
}
class VendorController {
    constructor(vendorService, cacheService) {
        this.vendorService = vendorService;
        this.cacheService = cacheService;
    }
    async createVendor(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const tenantId = req.user.tenantId;
            const vendorData = {
                ...req.body,
                billingAddress: req.body.address,
                shippingAddress: req.body.address,
            };
            delete vendorData.address;
            const vendor = await this.vendorService.createVendor(tenantId, vendorData);
            await this.cacheService.invalidatePattern(`vendors:${tenantId}:*`);
            await this.cacheService.invalidatePattern(`cache:${tenantId}:/api/vendors*`);
            res.status(201).json(vendor);
        }
        catch (error) {
            logger_1.default.error('Error creating vendor:', error);
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }
    async getVendor(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const { id } = req.params;
            const tenantId = req.user.tenantId;
            const vendor = await this.vendorService.getVendor(tenantId, id);
            res.json(vendor);
        }
        catch (error) {
            logger_1.default.error('Error fetching vendor:', error);
            res.status(404).json({ error: getErrorMessage(error) });
        }
    }
    async getVendors(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const tenantId = req.user.tenantId;
            const { page = 1, limit = 10, name, email, phone, status, joinedFrom, joinedTo } = req.query;
            const options = {
                page: Number(page),
                limit: Number(limit),
                name: name,
                email: email,
                phone: phone,
                status: status,
                joinedFrom: joinedFrom,
                joinedTo: joinedTo,
            };
            const vendors = await this.vendorService.getVendors(tenantId, options);
            res.json(vendors);
        }
        catch (error) {
            logger_1.default.error('Error fetching vendors:', error);
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }
    async updateVendor(req, res) {
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
            const vendor = await this.vendorService.updateVendor(tenantId, id, updates);
            await this.cacheService.del(`vendor:${id}:${tenantId}`);
            await this.cacheService.invalidatePattern(`vendors:${tenantId}:*`);
            await this.cacheService.invalidatePattern(`cache:${tenantId}:/api/vendors*`);
            res.json(vendor);
        }
        catch (error) {
            logger_1.default.error('Error updating vendor:', error);
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }
    async deleteVendor(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const { id } = req.params;
            const tenantId = req.user.tenantId;
            await this.vendorService.deleteVendor(tenantId, id);
            await this.cacheService.del(`vendor:${id}:${tenantId}`);
            await this.cacheService.invalidatePattern(`vendors:${tenantId}:*`);
            await this.cacheService.invalidatePattern(`cache:${tenantId}:/api/vendors*`);
            res.status(204).send();
        }
        catch (error) {
            logger_1.default.error('Error deleting vendor:', error);
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }
    async searchVendors(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const tenantId = req.user.tenantId;
            const { query } = req.query;
            const vendors = await this.vendorService.searchVendors(tenantId, query);
            res.json(vendors);
        }
        catch (error) {
            logger_1.default.error('Error searching vendors:', error);
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }
    async getVendorBalance(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            const { id } = req.params;
            const tenantId = req.user.tenantId;
            const balance = await this.vendorService.getVendorBalance(tenantId, id);
            return res.json(balance);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async createPayment(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            const tenantId = req.user.tenantId;
            const { amount, vendorId } = req.body;
            const balanceResult = await this.vendorService.getVendorBalance(tenantId, vendorId);
            const balance = parseFloat(Number(balanceResult.balance || 0).toFixed(2));
            if (amount > balance) {
                return res.status(400).json({
                    error: `Payment exceeds outstanding balance. Remaining balance: ${balance}`,
                });
            }
            const payment = await this.vendorService.recordPayment(req.body);
            await this.cacheService.del(`vendor:${vendorId}:${tenantId}`);
            await this.cacheService.invalidatePattern(`vendors:${tenantId}:*`);
            await this.cacheService.invalidatePattern(`cache:${tenantId}:/api/vendors*`);
            return res.json(payment);
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    async getPaymentHistory(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            const { id } = req.params;
            const tenantId = req.user.tenantId;
            const history = await this.vendorService.getVendorPaymentHistory(tenantId, id);
            return res.json(history);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.VendorController = VendorController;
//# sourceMappingURL=VendorController.js.map