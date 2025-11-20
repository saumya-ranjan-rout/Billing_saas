"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionService = void 0;
const typeorm_1 = require("typeorm");
const database_1 = require("../../config/database");
const Subscription_1 = require("../../entities/Subscription");
const SubscriptionPlan_1 = require("../../entities/SubscriptionPlan");
const Payment_1 = require("../../entities/Payment");
const User_1 = require("../../entities/User");
const Tenant_1 = require("../../entities/Tenant");
const logger_1 = __importDefault(require("../../utils/logger"));
class SubscriptionService {
    constructor() {
        this.subscriptionRepository = database_1.AppDataSource.getRepository(Subscription_1.Subscription);
        this.planRepository = database_1.AppDataSource.getRepository(SubscriptionPlan_1.SubscriptionPlan);
        this.paymentRepository = database_1.AppDataSource.getRepository(Payment_1.Payment);
        this.userRepository = database_1.AppDataSource.getRepository(User_1.User);
    }
    async initializeDefaultPlans() {
        const repo = database_1.AppDataSource.getRepository(SubscriptionPlan_1.SubscriptionPlan);
        const defaultPlans = [
            { name: "Free Trial", price: 0, durationDays: 7, isActive: true },
            { name: "Basic", price: 299, durationDays: 30, isActive: true },
            { name: "Pro", price: 1499, durationDays: 365, isActive: true },
        ];
        for (const plan of defaultPlans) {
            const exists = await repo.findOne({ where: { name: plan.name } });
            if (!exists) {
                await repo.save(repo.create(plan));
            }
        }
        return true;
    }
    async getActivePlans() {
        return this.planRepository.find({
            where: { isActive: true },
            order: { price: 'ASC' },
        });
    }
    async createSubscription(userId, planId, paymentGateway = Payment_1.PaymentGateway.RAZORPAY) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user)
            throw new Error('User not found');
        const plan = await this.planRepository.findOne({ where: { id: planId } });
        if (!plan)
            throw new Error('Plan not found');
        const queryRunner = database_1.AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const existingSubscription = await this.subscriptionRepository.findOne({
                where: {
                    tenantId: user.tenantId,
                    status: (0, typeorm_1.In)([Subscription_1.SubscriptionStatus.ACTIVE, Subscription_1.SubscriptionStatus.TRIAL]),
                    endDate: (0, typeorm_1.MoreThan)(new Date()),
                },
                order: { endDate: 'DESC' },
            });
            let startDate;
            let endDate;
            if (existingSubscription) {
                startDate = new Date(existingSubscription.endDate);
                endDate = new Date(startDate);
                endDate.setDate(startDate.getDate() + (plan.validityDays || 365));
            }
            else {
                startDate = new Date();
                endDate = new Date();
                endDate.setDate(endDate.getDate() + (plan.validityDays || 365));
            }
            const subscription = this.subscriptionRepository.create({
                userId,
                planId: plan.id,
                status: Subscription_1.SubscriptionStatus.PENDING,
                startDate,
                endDate,
                autoRenew: false,
                tenantId: user.tenantId,
                metadata: { createdBy: 'system' },
            });
            const savedSubscription = await queryRunner.manager.save(Subscription_1.Subscription, subscription);
            const payment = this.paymentRepository.create({
                userId,
                subscriptionId: savedSubscription.id,
                amount: plan.price,
                currency: plan.currency || 'INR',
                status: Payment_1.PaymentStatus.PENDING,
                gateway: paymentGateway,
                description: `Subscription payment for ${plan.name}`,
                tenantId: user.tenantId,
            });
            const savedPayment = await queryRunner.manager.save(Payment_1.Payment, payment);
            await queryRunner.commitTransaction();
            return { subscription: savedSubscription, payment: savedPayment };
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            logger_1.default.error('createSubscription error:', err);
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
    async activateFreeTrial(subscriptionId) {
        const subscriptionRepo = database_1.AppDataSource.getRepository(Subscription_1.Subscription);
        const subscription = await subscriptionRepo.findOne({ where: { id: subscriptionId } });
        if (!subscription)
            throw new Error('Subscription not found');
        subscription.status = Subscription_1.SubscriptionStatus.TRIAL;
        subscription.startDate = new Date();
        subscription.endDate = new Date(new Date().setDate(new Date().getDate() + 5));
        await subscriptionRepo.save(subscription);
    }
    async processPaymentSuccess(paymentId, gatewayPaymentId, gatewayResponse) {
        const queryRunner = database_1.AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const payment = await this.paymentRepository.findOne({
                where: { id: paymentId },
                relations: ['subscription', 'subscription.plan'],
            });
            if (!payment)
                throw new Error('Payment not found');
            payment.status = Payment_1.PaymentStatus.COMPLETED;
            payment.gatewayPaymentId = gatewayPaymentId;
            payment.gatewayResponse = gatewayResponse;
            payment.paidAt = new Date();
            await queryRunner.manager.save(Payment_1.Payment, payment);
            const subscription = payment.subscription;
            subscription.status = Subscription_1.SubscriptionStatus.ACTIVE;
            const updatedSubscription = await queryRunner.manager.save(Subscription_1.Subscription, subscription);
            await this.updateUserLimits(subscription.userId, subscription.plan);
            await queryRunner.commitTransaction();
            return { subscription: updatedSubscription, payment };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            logger_1.default.error('processPaymentSuccess error:', error);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async cancelSubscription(userId) {
        const subscription = await this.subscriptionRepository.findOne({
            where: { userId, status: Subscription_1.SubscriptionStatus.ACTIVE },
        });
        if (!subscription)
            throw new Error('No active subscription found');
        subscription.status = Subscription_1.SubscriptionStatus.CANCELLED;
        subscription.cancelledAt = new Date();
        subscription.autoRenew = false;
        return await this.subscriptionRepository.save(subscription);
    }
    async getUserSubscription(userId) {
        return this.subscriptionRepository.findOne({
            where: { userId },
            relations: ['plan', 'payments'],
            order: { createdAt: 'DESC' },
        });
    }
    async getUserSubscriptionHistory(userId, tenantId) {
        const subs = await this.subscriptionRepository.find({
            where: tenantId ? { tenantId } : { userId },
            relations: ['plan'],
            order: { createdAt: 'DESC' },
        });
        const now = new Date();
        return subs.map((s) => {
            const end = s.endDate ? new Date(s.endDate) : null;
            let status = s.status;
            if (s.status === Subscription_1.SubscriptionStatus.ACTIVE && end && end < now) {
                status = Subscription_1.SubscriptionStatus.EXPIRED;
            }
            else if ([Subscription_1.SubscriptionStatus.CANCELLED, Subscription_1.SubscriptionStatus.EXPIRED, Subscription_1.SubscriptionStatus.INACTIVE].includes(s.status)) {
                status = Subscription_1.SubscriptionStatus.EXPIRED;
            }
            else if (s.status === Subscription_1.SubscriptionStatus.PENDING) {
                status = Subscription_1.SubscriptionStatus.PENDING;
            }
            else if (s.status === Subscription_1.SubscriptionStatus.TRIAL) {
                status = Subscription_1.SubscriptionStatus.TRIAL;
            }
            else if (s.status === Subscription_1.SubscriptionStatus.ACTIVE) {
                status = Subscription_1.SubscriptionStatus.ACTIVE;
            }
            return {
                id: s.id,
                planId: s.planId,
                planName: s.plan?.name || 'Plan',
                status,
                startDate: s.startDate,
                endDate: s.endDate,
                createdAt: s.createdAt,
                metadata: s.metadata,
            };
        });
    }
    async updateUserLimits(userId, plan) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (user && user.tenantId) {
            logger_1.default.info(`Updated limits for user ${userId} based on plan ${plan?.name}`);
        }
    }
    async getSubscriptionStats(tenantId) {
        const totalSubscriptions = await this.subscriptionRepository.count({ where: { tenantId } });
        const activeSubscriptions = await this.subscriptionRepository.count({
            where: { tenantId, status: Subscription_1.SubscriptionStatus.ACTIVE },
        });
        const revenueResult = await this.paymentRepository
            .createQueryBuilder('payment')
            .select('SUM(payment.amount)', 'total')
            .where('payment.tenantId = :tenantId', { tenantId })
            .andWhere('payment.status = :status', { status: Payment_1.PaymentStatus.COMPLETED })
            .getRawOne();
        const monthlyRevenueResult = await this.paymentRepository
            .createQueryBuilder('payment')
            .select('SUM(payment.amount)', 'total')
            .where('payment.tenantId = :tenantId', { tenantId })
            .andWhere('payment.status = :status', { status: Payment_1.PaymentStatus.COMPLETED })
            .andWhere('payment.createdAt >= :startDate', {
            startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        })
            .getRawOne();
        return {
            totalSubscriptions,
            activeSubscriptions,
            totalRevenue: parseFloat(revenueResult?.total || 0),
            monthlyRecurringRevenue: parseFloat(monthlyRevenueResult?.total || 0),
        };
    }
    async createTenantSubscription(data) {
        const { tenantId, planId, paymentGateway = Payment_1.PaymentGateway.RAZORPAY, status, startDate, endDate } = data;
        const plan = await this.planRepository.findOne({ where: { id: planId } });
        if (!plan)
            throw new Error('Plan not found');
        const queryRunner = database_1.AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const subscription = this.subscriptionRepository.create({
                tenantId,
                planId: plan.id,
                status: status || Subscription_1.SubscriptionStatus.PENDING,
                startDate: startDate || new Date(),
                endDate: endDate ||
                    (() => {
                        const d = new Date();
                        d.setDate(d.getDate() + (plan.validityDays || 30));
                        return d;
                    })(),
                autoRenew: false,
                metadata: { createdBy: 'system' },
            });
            const savedSubscription = await queryRunner.manager.save(Subscription_1.Subscription, subscription);
            if (status !== Subscription_1.SubscriptionStatus.TRIAL) {
                const payment = this.paymentRepository.create({
                    tenantId,
                    subscriptionId: savedSubscription.id,
                    amount: plan.price,
                    currency: plan.currency || 'INR',
                    status: Payment_1.PaymentStatus.PENDING,
                    gateway: paymentGateway,
                    description: `Subscription payment for ${plan.name}`,
                });
                await queryRunner.manager.save(Payment_1.Payment, payment);
            }
            await queryRunner.commitTransaction();
            return savedSubscription;
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
    async cancelAllSubscriptions(tenantId) {
        const activeSubs = await this.subscriptionRepository.find({
            where: { tenantId, status: Subscription_1.SubscriptionStatus.ACTIVE },
        });
        for (const sub of activeSubs) {
            sub.status = Subscription_1.SubscriptionStatus.CANCELLED;
            sub.cancelledAt = new Date();
            sub.autoRenew = false;
            await this.subscriptionRepository.save(sub);
        }
        return activeSubs;
    }
    async getPlanById(planId) {
        return this.planRepository.findOne({ where: { id: planId } });
    }
    async createSubscriptionAfterPayment(userId, tenantId, planId, razorpayPaymentId, razorpayOrderId) {
        const plan = await this.planRepository.findOne({ where: { id: planId } });
        if (!plan)
            throw new Error('Plan not found');
        const queryRunner = database_1.AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const startDate = new Date();
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + (plan.validityDays || 365));
            const subscription = this.subscriptionRepository.create({
                userId,
                tenantId,
                planId,
                status: Subscription_1.SubscriptionStatus.ACTIVE,
                startDate,
                endDate,
                autoRenew: false,
                metadata: { razorpayOrderId },
            });
            const savedSubscription = await queryRunner.manager.save(Subscription_1.Subscription, subscription);
            const payment = this.paymentRepository.create({
                userId,
                tenantId,
                subscriptionId: savedSubscription.id,
                amount: plan.price,
                currency: plan.currency || 'INR',
                gateway: Payment_1.PaymentGateway.RAZORPAY,
                status: Payment_1.PaymentStatus.COMPLETED,
                gatewayPaymentId: razorpayPaymentId,
                description: `Subscription payment for ${plan.name}`,
                paidAt: new Date(),
            });
            const savedPayment = await queryRunner.manager.save(Payment_1.Payment, payment);
            await queryRunner.commitTransaction();
            return { subscription: savedSubscription, payment: savedPayment };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            logger_1.default.error('createSubscriptionAfterPayment error:', error);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async professionalOnboardsTenant(professionalId, tenantData, planId, paymentMethodId) {
        const queryRunner = database_1.AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const tenant = new Tenant_1.Tenant();
            tenant.name = tenantData.name;
            const savedTenant = await queryRunner.manager.save(tenant);
            const subscription = new Subscription_1.Subscription();
            subscription.tenant = savedTenant;
            subscription.planId = planId;
            subscription.startDate = new Date();
            const savedSubscription = await queryRunner.manager.save(subscription);
            await queryRunner.commitTransaction();
            return {
                tenant: savedTenant,
                subscription: savedSubscription
            };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async getProfessionalSubscriptions(professionalId) {
        const subscriptionRepo = database_1.AppDataSource.getRepository(Subscription_1.Subscription);
        const subscriptions = await subscriptionRepo.find({
            relations: ["tenant"]
        });
        return subscriptions;
    }
    async subscribeTenant(tenantId, planId, paymentMethodId, professionalId) {
        const queryRunner = database_1.AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const subscription = new Subscription_1.Subscription();
            subscription.tenantId = tenantId;
            subscription.planId = planId;
            subscription.startDate = new Date();
            if (professionalId) {
            }
            const savedSubscription = await queryRunner.manager.save(subscription);
            await queryRunner.commitTransaction();
            return savedSubscription;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async getSubscriptionPlans() {
        const planRepo = database_1.AppDataSource.getRepository(SubscriptionPlan_1.SubscriptionPlan);
        const plans = await planRepo.find();
        return plans;
    }
    async checkAccess(userId, tenantId) {
        const subscription = await this.getUserSubscription(userId);
        if (!subscription)
            return false;
        const now = new Date();
        const end = new Date(subscription.endDate);
        return end > now && subscription.status === 'active';
    }
    async markPaymentFailed(paymentId, reason) {
        const repo = database_1.AppDataSource.getRepository(Payment_1.Payment);
        const payment = await repo.findOne({ where: { id: paymentId } });
        if (!payment)
            throw new Error("Payment not found");
        payment.status = Payment_1.PaymentStatus.FAILED;
        payment.failureReason = reason || 'Unknown error';
        await repo.save(payment);
        return true;
    }
}
exports.SubscriptionService = SubscriptionService;
//# sourceMappingURL=SubscriptionService.js.map