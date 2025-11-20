"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantProvisioningService = void 0;
const User_1 = require("../../entities/User");
const TenantService_1 = require("./TenantService");
const UserService_1 = require("../auth/UserService");
const SubscriptionService_1 = require("../subscription/SubscriptionService");
const database_1 = require("../../config/database");
const Tenant_1 = require("../../entities/Tenant");
const Subscription_1 = require("../../entities/Subscription");
const planId = 'free_trial';
const trialDays = 14;
const trialEndDate = new Date();
trialEndDate.setDate(trialEndDate.getDate() + trialDays);
const billingCycle = 'monthly';
class TenantProvisioningService {
    constructor() {
        this.tenantService = new TenantService_1.TenantService();
        this.userService = new UserService_1.UserService();
        this.subscriptionService = new SubscriptionService_1.SubscriptionService();
    }
    async provisionNewTenant(tenantData, adminUserData) {
        const queryRunner = database_1.AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const tenant = await this.tenantService.createTenant(tenantData);
            const adminUser = await this.userService.createUser({
                ...adminUserData,
                tenantId: tenant.id,
                role: User_1.UserRole.ADMIN,
                status: User_1.UserStatus.ACTIVE,
            });
            await this.subscriptionService.createTenantSubscription({
                tenantId: tenant.id,
                planId: planId,
                status: Subscription_1.SubscriptionStatus.TRIAL,
                startDate: new Date(),
                endDate: trialEndDate,
            });
            await queryRunner.commitTransaction();
            return { tenant, adminUser };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async deprovisionTenant(tenantId) {
        const queryRunner = database_1.AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await this.subscriptionService.cancelAllSubscriptions(tenantId);
            await this.userService.deactivateAllUsers(tenantId);
            await this.tenantService.updateTenantStatus(tenantId, Tenant_1.TenantStatus.SUSPENDED);
            await queryRunner.commitTransaction();
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
}
exports.TenantProvisioningService = TenantProvisioningService;
//# sourceMappingURL=TenantProvisioningService.js.map