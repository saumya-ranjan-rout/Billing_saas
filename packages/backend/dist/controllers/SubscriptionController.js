"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionController = void 0;
const SubscriptionService_1 = require("../services/subscription/SubscriptionService");
const RazorpayService_1 = require("../services/payment/RazorpayService");
const response_1 = require("../utils/response");
const logger_1 = __importDefault(require("../utils/logger"));
class SubscriptionController {
    constructor() {
        this.subscriptionService = new SubscriptionService_1.SubscriptionService();
        this.razorpayService = new RazorpayService_1.RazorpayService();
    }
    async getPlans(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const userId = req.user.id;
            const tenantId = req.user.tenantId;
            const plans = await this.subscriptionService.getActivePlans();
            const history = await this.subscriptionService.getUserSubscriptionHistory(userId, tenantId);
            const today = new Date();
            const currentPlan = history.find((s) => {
                const startDate = new Date(s.startDate);
                const endDate = new Date(s.endDate);
                return endDate > today && startDate < today && (s.status === 'active' || s.status === 'trial');
            }) || null;
            return (0, response_1.ok)(res, { plans, history, currentPlan }, 'Subscription plans fetched successfully');
        }
        catch (error) {
            logger_1.default.error('Error fetching subscription plans:', error);
            return (0, response_1.errorResponse)(res, 'Failed to fetch subscription plans');
        }
    }
    async createSubscription(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const userId = req.user.id;
            const tenantId = req.user.tenantId;
            const { planId, paymentGateway = 'razorpay' } = req.body;
            const plan = await this.subscriptionService.getPlanById(planId);
            if (!plan)
                throw new Error('Subscription plan not found');
            const { subscription, payment } = await this.subscriptionService.createSubscription(userId, planId, paymentGateway);
            if (Number(plan.price) === 0) {
                await this.subscriptionService.activateFreeTrial(subscription.id);
                return (0, response_1.created)(res, {
                    subscriptionId: subscription.id,
                    message: 'Free trial activated successfully',
                    freeTrial: true
                });
            }
            const order = await this.razorpayService.createOrder(payment);
            return (0, response_1.created)(res, {
                orderId: order.id,
                amount: order.amount,
                currency: order.currency,
                paymentId: payment.id,
                subscriptionId: subscription.id
            }, 'Order created');
        }
        catch (error) {
            logger_1.default.error('Error creating subscription/order:', error);
            return (0, response_1.errorResponse)(res, 'Failed to create subscription order');
        }
    }
    async handlePaymentSuccess(req, res) {
        try {
            const { razorpay_payment_id, razorpay_order_id, razorpay_signature, payment_id } = req.body;
            const isValid = await this.razorpayService.verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
            if (!isValid) {
                return (0, response_1.errorResponse)(res, 'Invalid payment signature', 400);
            }
            const { subscription, payment } = await this.subscriptionService.processPaymentSuccess(payment_id, razorpay_payment_id, req.body);
            return (0, response_1.ok)(res, { subscription, payment }, 'Payment processed successfully');
        }
        catch (error) {
            logger_1.default.error('Error processing payment success:', error);
            return (0, response_1.errorResponse)(res, 'Failed to process payment');
        }
    }
    async getCurrentSubscription(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const userId = req.user.id;
            const subscription = await this.subscriptionService.getUserSubscription(userId);
            if (!subscription) {
                return (0, response_1.errorResponse)(res, 'No subscription found', 404);
            }
            return (0, response_1.ok)(res, subscription, 'Subscription fetched successfully');
        }
        catch (error) {
            logger_1.default.error('Error fetching subscription:', error);
            return (0, response_1.errorResponse)(res, 'Failed to fetch subscription');
        }
    }
    async cancelSubscription(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const userId = req.user.id;
            const subscription = await this.subscriptionService.cancelSubscription(userId);
            return (0, response_1.ok)(res, subscription, 'Subscription cancelled successfully');
        }
        catch (error) {
            logger_1.default.error('Error cancelling subscription:', error);
            return (0, response_1.errorResponse)(res, 'Failed to cancel subscription');
        }
    }
    async getStats(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const tenantId = req.user.tenantId;
            const stats = await this.subscriptionService.getSubscriptionStats(tenantId);
            return (0, response_1.ok)(res, stats, 'Subscription stats fetched successfully');
        }
        catch (error) {
            logger_1.default.error('Error fetching subscription stats:', error);
            return (0, response_1.errorResponse)(res, 'Failed to fetch subscription stats');
        }
    }
    async checkAccess(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const userId = req.user.id;
            const tenantId = req.user.tenantId;
            const hasAccess = await this.subscriptionService.checkAccess(userId, tenantId);
            return (0, response_1.ok)(res, { access: hasAccess }, 'Access verified');
        }
        catch (error) {
            logger_1.default.error('Error checking access:', error);
            return (0, response_1.errorResponse)(res, 'Failed to verify access');
        }
    }
    async handlePaymentFailure(req, res) {
        try {
            const { payment_id, reason } = req.body;
            await this.subscriptionService.markPaymentFailed(payment_id, reason);
            return (0, response_1.ok)(res, { paymentId: payment_id }, 'Payment failure recorded');
        }
        catch (error) {
            logger_1.default.error('Error handling payment failure:', error);
            return (0, response_1.errorResponse)(res, 'Failed to record payment failure');
        }
    }
}
exports.SubscriptionController = SubscriptionController;
//# sourceMappingURL=SubscriptionController.js.map