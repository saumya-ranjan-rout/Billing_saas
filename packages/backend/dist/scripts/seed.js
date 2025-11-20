"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
const Tenant_1 = require("../entities/Tenant");
const User_1 = require("../entities/User");
const SubscriptionPlan_1 = require("../entities/SubscriptionPlan");
const logger_1 = __importDefault(require("../utils/logger"));
const Tenant_2 = require("../entities/Tenant");
const seed = async () => {
    try {
        const connection = await database_1.AppDataSource.initialize();
        logger_1.default.info('Database connection established for seeding');
        const planRepository = connection.getRepository(SubscriptionPlan_1.SubscriptionPlan);
        const plans = planRepository.create([
            {
                planType: SubscriptionPlan_1.PlanType.BASIC,
                name: 'Basic',
                description: 'Basic plan with limited features',
                price: 999,
                billingCycle: SubscriptionPlan_1.BillingCycle.MONTHLY,
                features: {
                    maxUsers: 2,
                    maxStorage: 500,
                    gstFiling: false,
                    taxFiling: false,
                    advancedReporting: false,
                    apiAccess: false,
                    prioritySupport: false,
                },
            },
            {
                planType: SubscriptionPlan_1.PlanType.PROFESSIONAL,
                name: 'Professional',
                description: 'Professional plan with extended features',
                price: 2999,
                billingCycle: SubscriptionPlan_1.BillingCycle.MONTHLY,
                features: {
                    maxUsers: 5,
                    maxStorage: 2000,
                    gstFiling: true,
                    taxFiling: true,
                    advancedReporting: true,
                    apiAccess: false,
                    prioritySupport: true,
                },
            },
            {
                planType: SubscriptionPlan_1.PlanType.ENTERPRISE,
                name: 'Enterprise',
                description: 'Enterprise plan with all features',
                price: 4999,
                billingCycle: SubscriptionPlan_1.BillingCycle.MONTHLY,
                features: {
                    maxUsers: 10,
                    maxStorage: 10000,
                    gstFiling: true,
                    taxFiling: true,
                    advancedReporting: true,
                    apiAccess: true,
                    prioritySupport: true,
                },
            },
        ]);
        await planRepository.save(plans);
        logger_1.default.info('Subscription plans created');
        const enterprisePlan = await planRepository.findOne({
            where: { name: 'Enterprise' },
        });
        if (!enterprisePlan) {
            throw new Error('Enterprise plan not found!');
        }
        const tenantRepository = connection.getRepository(Tenant_1.Tenant);
        const tenant = tenantRepository.create({
            name: 'Default Tenant',
            businessName: 'Default Business',
            subdomain: 'default',
            slug: 'default-tenant',
            status: Tenant_2.TenantStatus.ACTIVE,
            isActive: true,
        });
        await tenantRepository.save(tenant);
        logger_1.default.info('Default tenant created');
        const userRepository = connection.getRepository(User_1.User);
        const adminUser = userRepository.create({
            email: 'admin@demo.com',
            password: '123456',
            firstName: 'System',
            lastName: 'Admin',
            role: User_1.UserRole.ADMIN,
            tenant: tenant,
        });
        await userRepository.save(adminUser);
        logger_1.default.info('Admin user created');
        await connection.destroy();
        logger_1.default.info('Seeding completed successfully ✅');
    }
    catch (error) {
        logger_1.default.error('Seeding error: ' + error.message, error);
        process.exit(1);
    }
};
seed();
//# sourceMappingURL=seed.js.map