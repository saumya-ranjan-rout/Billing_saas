"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoyaltyController = void 0;
const express_validator_1 = require("express-validator");
const logger_1 = __importDefault(require("../utils/logger"));
function getErrorMessage(error) {
    if (error instanceof Error) {
        return error.message;
    }
    return String(error);
}
class LoyaltyController {
    constructor(loyaltyService) {
        this.loyaltyService = loyaltyService;
    }
    async processInvoice(req, res) {
        try {
            const { invoiceId } = req.params;
            await this.loyaltyService.processInvoiceForLoyalty(invoiceId);
            res.json({
                success: true,
                message: 'Invoice processed for loyalty points'
            });
        }
        catch (error) {
            logger_1.default.error('Invoice processing error:', error);
            res.status(400).json({
                success: false,
                error: getErrorMessage(error)
            });
        }
    }
    async redeemCashback(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const tenantId = req.user?.tenantId;
            const { customerId, amount, invoiceId } = req.body;
            const transaction = await this.loyaltyService.redeemCashback(tenantId, customerId, amount, invoiceId);
            res.json({
                success: true,
                transaction,
                message: 'Cashback redeemed successfully'
            });
        }
        catch (error) {
            logger_1.default.error('Cashback redemption error:', error);
            res.status(400).json({
                success: false,
                error: getErrorMessage(error)
            });
        }
    }
    async getCustomerSummary(req, res) {
        try {
            const tenantId = req.user?.tenantId;
            const { customerId } = req.params;
            const summary = await this.loyaltyService.getCustomerLoyaltySummary(tenantId, customerId);
            res.json({
                success: true,
                ...summary
            });
        }
        catch (error) {
            logger_1.default.error('Customer summary error:', error);
            res.status(400).json({
                success: false,
                error: getErrorMessage(error)
            });
        }
    }
    async updateProgram(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const tenantId = req.user?.tenantId;
            const { programId } = req.params;
            const updates = req.body;
            const program = await this.loyaltyService.updateLoyaltyProgram(tenantId, programId, updates);
            res.json({
                success: true,
                program,
                message: 'Loyalty program updated successfully'
            });
        }
        catch (error) {
            logger_1.default.error('Program update error:', error);
            res.status(400).json({
                success: false,
                error: getErrorMessage(error)
            });
        }
    }
    async getProgramStats(req, res) {
        try {
            const tenantId = req.user?.tenantId;
            const { programId } = req.params;
            const stats = await this.loyaltyService.getProgramStatistics(tenantId, programId);
            res.json({
                success: true,
                ...stats
            });
        }
        catch (error) {
            logger_1.default.error('Program stats error:', error);
            res.status(400).json({
                success: false,
                error: getErrorMessage(error)
            });
        }
    }
    async calculateCashback(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const tenantId = req.user?.tenantId;
            const { customerId, amount } = req.body;
            const result = await this.loyaltyService.calculateCashback(tenantId, customerId, amount);
            res.json({
                success: true,
                ...result
            });
        }
        catch (error) {
            logger_1.default.error('Cashback calculation error:', error);
            res.status(400).json({
                success: false,
                error: getErrorMessage(error)
            });
        }
    }
    async getActiveProgram(req, res) {
        try {
            const tenantId = req.user?.tenantId;
            const program = await this.loyaltyService.getActiveProgram(tenantId);
            res.json({
                success: true,
                program
            });
        }
        catch (error) {
            logger_1.default.error('Get active program error:', error);
            res.status(400).json({
                success: false,
                error: getErrorMessage(error)
            });
        }
    }
}
exports.LoyaltyController = LoyaltyController;
//# sourceMappingURL=LoyaltyController.js.map