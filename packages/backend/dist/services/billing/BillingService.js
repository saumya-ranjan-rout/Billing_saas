"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingService = void 0;
const database_1 = require("../../config/database");
const SubscriptionPlan_1 = require("../../entities/SubscriptionPlan");
const Subscription_1 = require("../../entities/Subscription");
const Payment_1 = require("../../entities/Payment");
const Tenant_1 = require("../../entities/Tenant");
const RazorpayService_1 = require("./RazorpayService");
class BillingService {
    constructor() {
        this.subscriptionRepo = database_1.AppDataSource.getRepository(Subscription_1.Subscription);
        this.paymentRepo = database_1.AppDataSource.getRepository(Payment_1.Payment);
        this.planRepo = database_1.AppDataSource.getRepository(SubscriptionPlan_1.SubscriptionPlan);
        this.tenantRepo = database_1.AppDataSource.getRepository(Tenant_1.Tenant);
        this.razorpayService = new RazorpayService_1.RazorpayService();
    }
    async createSubscription(planType, entityId, paymentMethod) {
        const plan = await this.planRepo.findOne({ where: { type: planType } });
        if (!plan) {
            throw new Error("Invalid plan type");
        }
        const subscription = this.subscriptionRepo.create({
            userId: entityId,
            planId: plan.id,
            startDate: new Date(),
            endDate: null,
            status: Subscription_1.SubscriptionStatus.PENDING,
            autoRenew: false,
            metadata: { createdBy: "billing-service" },
        });
        const savedSubscription = await this.subscriptionRepo.save(subscription);
        const order = await this.razorpayService.createOrder(Number(plan.price));
        const payment = this.paymentRepo.create({
            userId: entityId,
            subscriptionId: savedSubscription.id,
            amount: Number(plan.price),
            currency: plan.currency || "INR",
            gateway: Payment_1.PaymentGateway.RAZORPAY,
            gatewayOrderId: order.id,
            status: Payment_1.PaymentStatus.PENDING,
            gatewayResponse: order,
            description: `Subscription payment for ${plan.name}`,
        });
        const savedPayment = await this.paymentRepo.save(payment);
        return { subscription: savedSubscription, payment: savedPayment };
    }
    async handlePaymentSuccess(paymentId, razorpayPaymentId, razorpayResponse) {
        const payment = await this.paymentRepo.findOne({
            where: { id: paymentId },
            relations: ["subscription"],
        });
        if (!payment) {
            throw new Error("Payment not found");
        }
        payment.status = Payment_1.PaymentStatus.COMPLETED;
        payment.gatewayPaymentId = razorpayPaymentId;
        payment.gatewayResponse = razorpayResponse;
        payment.paidAt = new Date();
        await this.paymentRepo.save(payment);
        if (payment.subscription) {
            payment.subscription.status = Subscription_1.SubscriptionStatus.ACTIVE;
            payment.subscription.startDate = new Date();
            payment.subscription.endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
            await this.subscriptionRepo.save(payment.subscription);
        }
        return payment;
    }
    async handlePaymentFailure(paymentId, razorpayResponse) {
        const payment = await this.paymentRepo.findOne({
            where: { id: paymentId },
            relations: ["subscription"],
        });
        if (!payment) {
            throw new Error("Payment not found");
        }
        payment.status = Payment_1.PaymentStatus.FAILED;
        payment.gatewayResponse = razorpayResponse;
        await this.paymentRepo.save(payment);
        if (payment.subscription) {
            payment.subscription.status = Subscription_1.SubscriptionStatus.CANCELLED;
            await this.subscriptionRepo.save(payment.subscription);
        }
        return payment;
    }
    async createProfessionalClientSubscription(professionalId, tenantData, paymentMethod) {
        const tenantEntity = this.tenantRepo.create({
            name: tenantData.name,
            businessName: tenantData.businessName,
            subdomain: tenantData.subdomain,
            slug: tenantData.slug,
            status: tenantData.status,
            accountType: tenantData.accountType,
            professionType: tenantData.professionType,
            licenseNo: tenantData.licenseNo,
            pan: tenantData.pan,
            gst: tenantData.gst,
            professionals: [{ id: professionalId }],
        });
        const savedTenant = await this.tenantRepo.save(tenantEntity);
        const { subscription, payment } = await this.createSubscription(SubscriptionPlan_1.PlanType.BASIC, savedTenant.id, paymentMethod);
        return { tenant: savedTenant, subscription, payment };
    }
    async checkSubscriptionStatus(entityId, planType) {
        const subscription = await this.subscriptionRepo.findOne({
            where: {
                tenant: { id: entityId },
                plan: { type: planType },
            },
            relations: ["tenant", "plan"],
            order: { createdAt: "DESC" },
        });
        if (!subscription) {
            return { status: "none", active: false };
        }
        return {
            status: subscription.status,
            active: subscription.status === Subscription_1.SubscriptionStatus.ACTIVE,
            subscription,
        };
    }
    async cancelSubscription(subscriptionId) {
        const subscription = await this.subscriptionRepo.findOne({
            where: { id: subscriptionId },
        });
        if (!subscription) {
            throw new Error("Subscription not found");
        }
        subscription.status = Subscription_1.SubscriptionStatus.CANCELLED;
        subscription.endDate = new Date();
        return await this.subscriptionRepo.save(subscription);
    }
    async getSubscriptionPayments(subscriptionId) {
        return this.paymentRepo.find({
            where: { subscription: { id: subscriptionId } },
            order: { createdAt: "DESC" },
        });
    }
}
exports.BillingService = BillingService;
//# sourceMappingURL=BillingService.js.map