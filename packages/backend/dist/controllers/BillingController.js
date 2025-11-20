"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingController = void 0;
const express_validator_1 = require("express-validator");
const logger_1 = __importDefault(require("../utils/logger"));
function getErrorMessage(error) {
    if (error instanceof Error) {
        return error.message;
    }
    return String(error);
}
class BillingController {
    constructor(billingService) {
        this.billingService = billingService;
    }
    async createSubscription(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { planType, entityId, paymentMethod } = req.body;
            const result = await this.billingService.createSubscription(planType, entityId, paymentMethod);
            res.json({
                success: true,
                subscription: result.subscription,
                payment: result.payment,
                razorpayOrder: result.payment.gatewayResponse
            });
        }
        catch (error) {
            logger_1.default.error('Create subscription error:', error);
            res.status(400).json({
                success: false,
                error: getErrorMessage(error)
            });
        }
    }
    async handlePaymentSuccess(req, res) {
        try {
            const { paymentId, razorpayPaymentId, razorpayResponse } = req.body;
            const payment = await this.billingService.handlePaymentSuccess(paymentId, razorpayPaymentId, razorpayResponse);
            res.json({
                success: true,
                payment,
                message: 'Payment successful! Subscription activated.'
            });
        }
        catch (error) {
            logger_1.default.error('Payment success handling error:', error);
            res.status(400).json({
                success: false,
                error: getErrorMessage(error)
            });
        }
    }
    async handlePaymentFailure(req, res) {
        try {
            const { paymentId, razorpayResponse } = req.body;
            const payment = await this.billingService.handlePaymentFailure(paymentId, razorpayResponse);
            res.json({
                success: false,
                payment,
                message: 'Payment failed. Please try again.'
            });
        }
        catch (error) {
            logger_1.default.error('Payment failure handling error:', error);
            res.status(400).json({
                success: false,
                error: getErrorMessage(error)
            });
        }
    }
    async createProfessionalClient(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const professionalId = req.user?.id;
            const { tenantData, paymentMethod } = req.body;
            const result = await this.billingService.createProfessionalClientSubscription(professionalId, tenantData, paymentMethod);
            res.json({
                success: true,
                tenant: result.tenant,
                subscription: result.subscription,
                payment: result.payment,
                razorpayOrder: result.payment.gatewayResponse
            });
        }
        catch (error) {
            logger_1.default.error('Professional client creation error:', error);
            res.status(400).json({
                success: false,
                error: getErrorMessage(error)
            });
        }
    }
    async getSubscriptionStatus(req, res) {
        try {
            const { entityId, planType } = req.params;
            const status = await this.billingService.checkSubscriptionStatus(entityId, planType);
            res.json({
                success: true,
                ...status
            });
        }
        catch (error) {
            logger_1.default.error('Subscription status check error:', error);
            res.status(400).json({
                success: false,
                error: getErrorMessage(error)
            });
        }
    }
    async cancelSubscription(req, res) {
        try {
            const { subscriptionId } = req.params;
            const subscription = await this.billingService.cancelSubscription(subscriptionId);
            res.json({
                success: true,
                subscription,
                message: 'Subscription cancelled successfully'
            });
        }
        catch (error) {
            logger_1.default.error('Subscription cancellation error:', error);
            res.status(400).json({
                success: false,
                error: getErrorMessage(error)
            });
        }
    }
    async getSubscriptionPayments(req, res) {
        try {
            const { subscriptionId } = req.params;
            const payments = await this.billingService.getSubscriptionPayments(subscriptionId);
            res.json({
                success: true,
                payments
            });
        }
        catch (error) {
            logger_1.default.error('Subscription payments fetch error:', error);
            res.status(400).json({
                success: false,
                error: getErrorMessage(error)
            });
        }
    }
    async handleRazorpayWebhook(req, res) {
        try {
            const signature = req.headers['x-razorpay-signature'];
            const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
            const isValid = this.billingService['razorpayService'].verifyWebhookSignature(req.body, signature, webhookSecret);
            if (!isValid) {
                return res.status(400).json({ error: 'Invalid webhook signature' });
            }
            const event = req.body;
            switch (event.event) {
                case 'payment.captured':
                    break;
                case 'payment.failed':
                    break;
                case 'subscription.charged':
                    break;
                case 'subscription.cancelled':
                    break;
            }
            res.json({ success: true });
        }
        catch (error) {
            logger_1.default.error('Webhook handling error:', error);
            res.status(400).json({ error: 'Webhook processing failed' });
        }
    }
}
exports.BillingController = BillingController;
//# sourceMappingURL=BillingController.js.map