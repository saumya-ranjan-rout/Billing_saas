import { BaseEntity } from './BaseEntity';
export declare enum PlanType {
    TENANT = "tenant",
    PROFESSIONAL = "professional"
}
export declare enum BillingPeriod {
    MONTHLY = "monthly",
    YEARLY = "yearly",
    LIFETIME = "lifetime"
}
export declare class SubscriptionPlan extends BaseEntity {
    name: string;
    planType: PlanType;
    billingPeriod: BillingPeriod;
    price: number;
    currency: string;
    features: string[];
    limits: {
        users?: number;
        customers?: number;
        invoices?: number;
        products?: number;
        storageMB?: number;
        clients?: number;
    };
    isActive: boolean;
    isDefault: boolean;
    description: string;
    trialDays: number;
}
//# sourceMappingURL=SubscriptionPlan1.d.ts.map