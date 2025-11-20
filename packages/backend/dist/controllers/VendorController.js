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
            const { page, limit, search } = req.query;
            const options = {
                page: parseInt(page) || 1,
                limit: parseInt(limit) || 10,
                search: search
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
}
exports.VendorController = VendorController;
//# sourceMappingURL=VendorController.js.map