import { TenantAwareEntity } from './BaseEntity';
import { Subscription } from './Subscription';
export declare enum PlanType {
    BASIC = "basic",
    PROFESSIONAL = "professional",
    ENTERPRISE = "enterprise"
}
export declare enum BillingCycle {
    FIVE_DAYS = "5days",
    WEEKLY = "weekly",
    MONTHLY = "monthly",
    YEARLY = "yearly"
}
export declare class SubscriptionPlan extends TenantAwareEntity {
    name: string;
    description: string;
    type: PlanType;
    price: number;
    currency: string;
    billingCycle: BillingCycle;
    maxTenants: number;
    maxBusinesses: number;
    maxUsers: number;
    features: string[];
    isActive: boolean;
    trialDays: number;
    validityDays: number;
    subscriptions: Subscription[];
}
//# sourceMappingURL=SubscriptionPlan.d.ts.map