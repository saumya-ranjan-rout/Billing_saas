"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionService = void 0;
const database_1 = require("../../config/database");
const SubscriptionPlan_1 = require("../../entities/SubscriptionPlan");
const TenantSubscription_1 = require("../../entities/TenantSubscription");
const Tenant_1 = require("../../entities/Tenant");
const ProfessionalUser_1 = require("../../entities/ProfessionalUser");
const StripeService_1 = require("../billing/StripeService");
const logger_1 = __importDefault(require("../../utils/logger"));
const common_1 = require("@nestjs/common");
let SubscriptionService = class SubscriptionService {
    constructor() {
        this.planRepository = database_1.AppDataSource.getRepository(SubscriptionPlan_1.SubscriptionPlan);
        this.subscriptionRepository = database_1.AppDataSource.getRepository(TenantSubscription_1.TenantSubscription);
        this.tenantRepository = database_1.AppDataSource.getRepository(Tenant_1.Tenant);
        this.professionalRepository = database_1.AppDataSource.getRepository(ProfessionalUser_1.ProfessionalUser);
        this.stripeService = new StripeService_1.StripeService();
    }
    async createSubscriptionPlan(planData) {
        try {
            const plan = this.planRepository.create(planData);
            return await this.planRepository.save(plan);
        }
        catch (error) {
            logger_1.default.error('Error creating subscription plan:', error);
            throw error;
        }
    }
    async createSubscription({ tenantId, plan, status = 'active', currentPeriodStart, currentPeriodEnd, stripeSubscriptionId, stripeCustomerId }) {
        const subscription = this.subscriptionRepository.create({
            tenantId,
            plan,
            status,
            currentPeriodStart,
            currentPeriodEnd,
            stripeSubscriptionId,
            stripeCustomerId,
            cancelAtPeriodEnd: false
        });
        return await this.subscriptionRepository.save(subscription);
    }
    async cancelAllSubscriptions(tenantId) {
        const activeSubscriptions = await this.subscriptionRepository.find({
            where: {
                tenantId,
                status: 'active'
            }
        });
        for (const subscription of activeSubscriptions) {
            subscription.status = 'canceled';
            subscription.cancelAtPeriodEnd = true;
            await this.subscriptionRepository.save(subscription);
        }
        return activeSubscriptions.length;
    }
    async getSubscriptionPlans() {
        return this.planRepository.find({ where: { isActive: true } });
    }
    async subscribeTenant(tenantId, planId, paymentMethodId, professionalId) {
        try {
            const tenant = await this.tenantRepository.findOne({ where: { id: tenantId } });
            const plan = await this.planRepository.findOne({ where: { id: planId } });
            if (!tenant || !plan) {
                throw new Error('Tenant or plan not found');
            }
            const startDate = new Date();
            const endDate = this.calculateEndDate(startDate, plan.billingCycle);
            const trialEndDate = this.calculateTrialEndDate(startDate);
            const stripeSubscription = await this.stripeService.createSubscription(professionalId ? professionalId : tenantId, plan, paymentMethodId);
            const subscriptionData = {
                tenantId,
                planId: plan.id,
                startDate,
                endDate,
                trialEndDate,
                amount: plan.price,
                stripeSubscriptionId: stripeSubscription.id,
                stripeCustomerId: stripeSubscription.customer,
                status: TenantSubscription_1.SubscriptionStatus.ACTIVE
            };
            if (professionalId) {
                const professional = await this.professionalRepository.findOne({
                    where: { id: professionalId }
                });
                if (professional) {
                    subscriptionData.isPaidByProfessional = true;
                    subscriptionData.paidByProfessionalId = professionalId;
                }
            }
            const subscription = this.subscriptionRepository.create(subscriptionData);
            return await this.subscriptionRepository.save(subscription);
        }
        catch (error) {
            logger_1.default.error('Error creating tenant subscription:', error);
            throw error;
        }
    }
    async professionalOnboardsTenant(professionalId, tenantData, planId, paymentMethodId) {
        try {
            const tenant = this.tenantRepository.create(tenantData);
            await this.tenantRepository.save(tenant);
            const subscription = await this.subscribeTenant(tenant.id, planId, paymentMethodId, professionalId);
            return { tenant, subscription };
        }
        catch (error) {
            logger_1.default.error('Error in professional onboarding tenant:', error);
            throw error;
        }
    }
    async getTenantSubscription(tenantId) {
        const subscription = await this.subscriptionRepository.findOne({
            where: { tenantId },
            relations: ['plan', 'paidByProfessional'],
            order: { createdAt: 'DESC' }
        });
        if (!subscription) {
            throw new Error('Subscription not found for tenant');
        }
        return subscription;
    }
    async cancelSubscription(tenantId) {
        try {
            const subscription = await this.getTenantSubscription(tenantId);
            await this.stripeService.cancelSubscription(subscription.stripeSubscriptionId);
            await this.subscriptionRepository.update({ id: subscription.id }, { status: TenantSubscription_1.SubscriptionStatus.CANCELLED });
        }
        catch (error) {
            logger_1.default.error('Error cancelling subscription:', error);
            throw error;
        }
    }
    async updateSubscription(tenantId, planId) {
        try {
            const currentSubscription = await this.getTenantSubscription(tenantId);
            const newPlan = await this.planRepository.findOne({ where: { id: planId } });
            if (!newPlan) {
                throw new Error('New plan not found');
            }
            const updatedStripeSubscription = await this.stripeService.updateSubscription(currentSubscription.stripeSubscriptionId, newPlan);
            await this.subscriptionRepository.update({ id: currentSubscription.id }, {
                planId: newPlan.id,
                amount: newPlan.price,
                endDate: this.calculateEndDate(new Date(), newPlan.billingCycle)
            });
            return this.getTenantSubscription(tenantId);
        }
        catch (error) {
            logger_1.default.error('Error updating subscription:', error);
            throw error;
        }
    }
    calculateEndDate(startDate, billingCycle) {
        const endDate = new Date(startDate);
        switch (billingCycle) {
            case SubscriptionPlan_1.BillingCycle.MONTHLY:
                endDate.setMonth(endDate.getMonth() + 1);
                break;
            case SubscriptionPlan_1.BillingCycle.QUARTERLY:
                endDate.setMonth(endDate.getMonth() + 3);
                break;
            case SubscriptionPlan_1.BillingCycle.ANNUALLY:
                endDate.setFullYear(endDate.getFullYear() + 1);
                break;
        }
        return endDate;
    }
    calculateTrialEndDate(startDate) {
        const trialEndDate = new Date(startDate);
        trialEndDate.setDate(trialEndDate.getDate() + 14);
        return trialEndDate;
    }
    async getProfessionalSubscriptions(professionalId) {
        return this.subscriptionRepository.find({
            where: { paidByProfessionalId: professionalId },
            relations: ['tenant', 'plan']
        });
    }
};
SubscriptionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], SubscriptionService);
exports.SubscriptionService = SubscriptionService;
//# sourceMappingURL=SubscriptionService1.js.map