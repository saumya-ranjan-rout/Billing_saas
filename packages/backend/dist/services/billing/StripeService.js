"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeService = void 0;
const stripe_1 = __importDefault(require("stripe"));
const ApplicationError_1 = require("../../errors/ApplicationError");
const StripeTypes_1 = require("../../types/billing/StripeTypes");
class StripeService {
    constructor() {
        const secretKey = process.env.STRIPE_SECRET_KEY;
        if (!secretKey) {
            throw new Error("Missing STRIPE_SECRET_KEY in environment variables");
        }
        this.stripe = new stripe_1.default(secretKey, {});
    }
    async createCustomer(data) {
        try {
            return await this.stripe.customers.create(data);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new ApplicationError_1.BadRequestError(`Failed to create Stripe customer: ${error.message}`);
            }
            throw new ApplicationError_1.BadRequestError("Failed to create Stripe customer: Unknown error");
        }
    }
    async createSubscription(customerId, plan, paymentMethodId) {
        try {
            await this.stripe.paymentMethods.attach(paymentMethodId, {
                customer: customerId,
            });
            await this.stripe.customers.update(customerId, {
                invoice_settings: {
                    default_payment_method: paymentMethodId,
                },
            });
            const subscription = await this.stripe.subscriptions.create({
                customer: customerId,
                items: [
                    {
                        price_data: {
                            currency: 'inr',
                            product: this.getStripeProductId(plan.planType),
                            recurring: {
                                interval: plan.billingCycle,
                            },
                            unit_amount: Math.round(plan.price * 100),
                        },
                    },
                ],
                payment_settings: {
                    payment_method_types: ['card'],
                    save_default_payment_method: 'on_subscription',
                },
                expand: ['latest_invoice.payment_intent'],
            });
            return subscription;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new ApplicationError_1.BadRequestError(`Failed to create Stripe subscription: ${error.message}`);
            }
            throw new ApplicationError_1.BadRequestError('Failed to create Stripe subscription: Unknown error');
        }
    }
    async createPaymentIntent(data) {
        try {
            return await this.stripe.paymentIntents.create({
                amount: data.amount,
                currency: data.currency,
                customer: data.customerId,
                metadata: data.metadata,
                automatic_payment_methods: {
                    enabled: true,
                },
            });
        }
        catch (error) {
            if (error instanceof Error) {
                throw new ApplicationError_1.BadRequestError(`Failed to create payment intent: ${error.message}`);
            }
            throw new ApplicationError_1.BadRequestError("Failed to create payment intent: Unknown error");
        }
    }
    async constructEvent(payload, signature, secret) {
        try {
            return this.stripe.webhooks.constructEvent(payload, signature, secret);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new ApplicationError_1.BadRequestError(`Webhook signature verification failed: ${error.message}`);
            }
            throw new ApplicationError_1.BadRequestError("Webhook signature verification failed: Unknown error");
        }
    }
    async handleWebhookEvent(event) {
        switch (event.type) {
            case 'payment_intent.succeeded':
                await this.handlePaymentIntentSucceeded(event.data.object);
                break;
            case 'invoice.payment_failed':
                await this.handleInvoicePaymentFailed(event.data.object);
                break;
            case 'customer.subscription.deleted':
                await this.handleSubscriptionDeleted(event.data.object);
                break;
        }
    }
    async handlePaymentIntentSucceeded(paymentIntent) {
        const invoiceId = paymentIntent.metadata?.invoiceId ?? null;
        const tenantId = paymentIntent.metadata?.tenantId ?? null;
    }
    async handleInvoicePaymentFailed(invoice) {
        const subscriptionId = typeof invoice.subscription === "string"
            ? invoice.subscription
            : invoice.subscription?.id;
        const tenantId = invoice.metadata?.tenantId ?? null;
    }
    async handleSubscriptionDeleted(subscription) {
        const tenantId = subscription.metadata?.tenantId ?? null;
    }
    async cancelSubscription(subscriptionId) {
        try {
            return await this.stripe.subscriptions.update(subscriptionId, {
                cancel_at_period_end: true,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                throw new ApplicationError_1.BadRequestError(`Failed to cancel Stripe subscription: ${error.message}`);
            }
            throw new ApplicationError_1.BadRequestError("Failed to cancel Stripe subscription: Unknown error");
        }
    }
    async updateSubscription(subscriptionId, newPlan) {
        try {
            const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
            return this.stripe.subscriptions.update(subscriptionId, {
                cancel_at_period_end: false,
                items: [
                    {
                        id: subscription.items.data[0].id,
                        price_data: {
                            currency: 'inr',
                            product: this.getStripeProductId(newPlan.planType),
                            recurring: {
                                interval: newPlan.billingCycle,
                            },
                            unit_amount: Math.round(newPlan.price * 100),
                        },
                    },
                ],
            });
        }
        catch (error) {
            if (error instanceof Error) {
                throw new ApplicationError_1.BadRequestError(`Failed to update Stripe subscription: ${error.message}`);
            }
            throw new ApplicationError_1.BadRequestError('Failed to update Stripe subscription: Unknown error');
        }
    }
    getStripeProductId(planType) {
        const productIds = {
            [StripeTypes_1.PlanType.BASIC]: process.env.STRIPE_BASIC_PRODUCT_ID,
            [StripeTypes_1.PlanType.PREMIUM]: process.env.STRIPE_PREMIUM_PRODUCT_ID,
            [StripeTypes_1.PlanType.ENTERPRISE]: process.env.STRIPE_ENTERPRISE_PRODUCT_ID,
        };
        const productId = productIds[planType];
        if (!productId) {
            throw new ApplicationError_1.BadRequestError(`Missing Stripe product ID for plan: ${planType}`);
        }
        return productId;
    }
}
exports.StripeService = StripeService;
//# sourceMappingURL=StripeService.js.map