import { TenantAwareEntity } from './BaseEntity';
import { SubscriptionPlan } from './SubscriptionPlan';
import { User } from './User';
import { Payment } from './Payment';
import { Tenant } from './Tenant';
export declare enum SubscriptionStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    PENDING = "pending",
    EXPIRED = "expired",
    CANCELLED = "cancelled",
    TRIAL = "trial"
}
export declare enum BillingCycle {
    MONTHLY = "monthly",
    QUARTERLY = "quarterly",
    YEARLY = "yearly"
}
export declare class Subscription extends TenantAwareEntity {
    userId: string;
    user: User;
    planId: string;
    plan: SubscriptionPlan;
    status: SubscriptionStatus;
    startDate: Date;
    endDate: Date;
    cancelledAt: Date;
    autoRenew: boolean;
    stripeSubscriptionId: string;
    razorpaySubscriptionId: string;
    metadata: Record<string, any>;
    payments: Payment[];
    tenant: Tenant;
}
//# sourceMappingURL=Subscription.d.ts.map