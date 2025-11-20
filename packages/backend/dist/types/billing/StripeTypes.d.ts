export declare enum PlanType {
    BASIC = "basic",
    PREMIUM = "premium",
    ENTERPRISE = "enterprise"
}
export interface SubscriptionPlan {
    planType: PlanType;
    price: number;
    billingCycle: 'month' | 'year';
}
//# sourceMappingURL=StripeTypes.d.ts.map