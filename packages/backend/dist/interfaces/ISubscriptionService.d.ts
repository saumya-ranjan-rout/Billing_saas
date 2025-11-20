import { BillingCycle, SubscriptionStatus } from '../entities/Subscription';
export interface ISubscriptionService {
    createSubscription(data: {
        tenantId: string;
        plan: string;
        name?: string;
        billingCycle?: BillingCycle;
        price?: number;
        userLimit?: number;
        invoiceLimit?: number;
        isActive?: boolean;
        status?: SubscriptionStatus;
        startDate: Date;
        endDate: Date;
        stripeSubscriptionId?: string;
        stripeCustomerId?: string;
    }): Promise<any>;
    cancelAllSubscriptions(tenantId: string): Promise<number>;
}
//# sourceMappingURL=ISubscriptionService.d.ts.map