import { Tenant } from './Tenant';
import { SubscriptionPlan } from './SubscriptionPlan';
import { ProfessionalUser } from './ProfessionalUser';
export declare enum SubscriptionStatus {
    ACTIVE = "active",
    PENDING = "pending",
    EXPIRED = "expired",
    CANCELLED = "cancelled",
    TRIAL = "trial"
}
export declare class TenantSubscription {
    id: string;
    tenant: Tenant;
    tenantId: string;
    plan: SubscriptionPlan;
    planId: string;
    status: SubscriptionStatus;
    startDate: Date;
    endDate: Date;
    trialEndDate: Date;
    amount: number;
    isPaidByProfessional: boolean;
    paidByProfessional: ProfessionalUser;
    paidByProfessionalId: string;
    stripeSubscriptionId: string;
    stripeCustomerId: string;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=TenantSubscription.d.ts.map