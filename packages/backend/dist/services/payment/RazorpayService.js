"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RazorpayService = void 0;
const razorpay_1 = __importDefault(require("razorpay"));
const logger_1 = __importDefault(require("../../utils/logger"));
class RazorpayService {
    constructor() {
        this.razorpay = new razorpay_1.default({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
    }
    async createOrder(payment) {
        try {
            const shortReceipt = `rcpt_${String(payment.id).slice(0, 30)}`;
            const options = {
                amount: Math.round(payment.amount * 100),
                currency: payment.currency || 'INR',
                receipt: shortReceipt,
                payment_capture: 1,
                notes: {
                    paymentId: payment.id,
                    subscriptionId: payment.subscriptionId,
                    userId: payment.userId
                }
            };
            logger_1.default.info('🧾 Razorpay createOrder options:', options);
            const order = await this.razorpay.orders.create(options);
            logger_1.default.info(`✅ Razorpay order created successfully: ${order.id}`);
            return {
                id: order.id,
                amount: Number(order.amount),
                currency: order.currency,
                receipt: order.receipt ?? '',
                status: order.status
            };
        }
        catch (error) {
            logger_1.default.error('❌ Failed to create Razorpay order:', error);
            if (error.error) {
                logger_1.default.error('🔎 Razorpay Error Response:', error.error);
            }
            throw new Error(error.error?.description || 'Failed to create payment order');
        }
    }
    async verifyPaymentSignature(orderId, paymentId, signature) {
        try {
            const crypto = require('crypto');
            const expectedSignature = crypto
                .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
                .update(orderId + '|' + paymentId)
                .digest('hex');
            return expectedSignature === signature;
        }
        catch (error) {
            logger_1.default.error('Error verifying payment signature:', error);
            return false;
        }
    }
    async capturePayment(paymentId, amount) {
        try {
            const capture = await this.razorpay.payments.capture(paymentId, Math.round(amount * 100), 'INR');
            logger_1.default.info(`Payment captured successfully: ${paymentId}`);
            return capture;
        }
        catch (error) {
            logger_1.default.error('Failed to capture payment:', error);
            throw error;
        }
    }
    async createSubscription(planId, totalCount = 1) {
        try {
            const subscription = await this.razorpay.subscriptions.create({
                plan_id: planId,
                total_count: totalCount,
                notes: {
                    description: 'Yearly subscription for BillingSoftware SaaS'
                }
            });
            return subscription;
        }
        catch (error) {
            logger_1.default.error('Failed to create Razorpay subscription:', error);
            throw error;
        }
    }
}
exports.RazorpayService = RazorpayService;
//# sourceMappingURL=RazorpayService.js.map