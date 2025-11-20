"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseController = void 0;
const express_validator_1 = require("express-validator");
const logger_1 = __importDefault(require("../utils/logger"));
function getErrorMessage(error) {
    if (error instanceof Error) {
        return error.message;
    }
    return String(error);
}
class PurchaseController {
    constructor(purchaseService) {
        this.purchaseService = purchaseService;
    }
    async createPurchaseOrder(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const tenantId = req.user.tenantId;
            const purchaseData = req.body;
            const purchaseOrder = await this.purchaseService.createPurchaseOrder(tenantId, purchaseData);
            res.status(201).json(purchaseOrder);
        }
        catch (error) {
            logger_1.default.error('Error creating purchase order:', error);
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }
    async getPurchaseOrder(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const { id } = req.params;
            const tenantId = req.user.tenantId;
            const purchaseOrder = await this.purchaseService.getPurchaseOrder(tenantId, id);
            res.json(purchaseOrder);
        }
        catch (error) {
            logger_1.default.error('Error fetching purchase order:', error);
            res.status(404).json({ error: getErrorMessage(error) });
        }
    }
    async getPurchaseOrders(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const tenantId = req.user.tenantId;
            const { page, limit, search, status, vendorId } = req.query;
            const options = {
                page: parseInt(page) || 1,
                limit: parseInt(limit) || 10,
                search: search,
                status: status,
                vendorId: vendorId
            };
            const purchaseOrders = await this.purchaseService.getPurchaseOrders(tenantId, options);
            res.json(purchaseOrders);
        }
        catch (error) {
            logger_1.default.error('Error fetching purchase orders:', error);
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }
    async updatePurchaseOrder(req, res) {
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
            const updates = req.body;
            const purchaseOrder = await this.purchaseService.updatePurchaseOrder(tenantId, id, updates);
            res.json(purchaseOrder);
        }
        catch (error) {
            logger_1.default.error('Error updating purchase order:', error);
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }
    async updatePurchaseOrderStatus(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const { id } = req.params;
            const { status } = req.body;
            const tenantId = req.user.tenantId;
            const purchaseOrder = await this.purchaseService.updatePurchaseOrderStatus(tenantId, id, status);
            res.json(purchaseOrder);
        }
        catch (error) {
            logger_1.default.error('Error updating purchase order status:', error);
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }
    async deletePurchaseOrder(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const { id } = req.params;
            const tenantId = req.user.tenantId;
            await this.purchaseService.deletePurchaseOrder(tenantId, id);
            res.status(204).send();
        }
        catch (error) {
            logger_1.default.error('Error deleting purchase order:', error);
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }
    async getVendorPurchaseOrders(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const { vendorId } = req.params;
            const tenantId = req.user.tenantId;
            const purchaseOrders = await this.purchaseService.getVendorPurchaseOrders(tenantId, vendorId);
            res.json(purchaseOrders);
        }
        catch (error) {
            logger_1.default.error('Error fetching vendor purchase orders:', error);
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }
    async getPurchaseOrderSummary(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const tenantId = req.user.tenantId;
            const summary = await this.purchaseService.getPurchaseOrderSummary(tenantId);
            res.json(summary);
        }
        catch (error) {
            logger_1.default.error('Error fetching purchase order summary:', error);
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }
}
exports.PurchaseController = PurchaseController;
//# sourceMappingURL=PurchaseController.js.map