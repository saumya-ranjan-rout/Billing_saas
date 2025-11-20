import { SubscriptionPlan } from '../../entities/SubscriptionPlan';
import { TenantSubscription } from '../../entities/TenantSubscription';
import { Tenant } from '../../entities/Tenant';
import { ISubscriptionService } from '../../interfaces/ISubscriptionService';
export declare class SubscriptionService implements ISubscriptionService {
    private planRepository;
    private subscriptionRepository;
    private tenantRepository;
    private professionalRepository;
    private stripeService;
    constructor();
    createSubscriptionPlan(planData: any): Promise<SubscriptionPlan>;
    createSubscription({ tenantId, plan, status, currentPeriodStart, currentPeriodEnd, stripeSubscriptionId, stripeCustomerId }: {
        tenantId: string;
        plan: string;
        status?: 'active' | 'canceled' | 'past_due' | 'unpaid';
        currentPeriodStart: Date;
        currentPeriodEnd: Date;
        stripeSubscriptionId?: string;
        stripeCustomerId?: string;
    }): Promise<TenantSubscription[]>;
    cancelAllSubscriptions(tenantId: string): Promise<number>;
    getSubscriptionPlans(): Promise<SubscriptionPlan[]>;
    subscribeTenant(tenantId: string, planId: string, paymentMethodId: string, professionalId?: string): Promise<TenantSubscription>;
    professionalOnboardsTenant(professionalId: string, tenantData: any, planId: string, paymentMethodId: string): Promise<{
        tenant: Tenant;
        subscription: TenantSubscription;
    }>;
    getTenantSubscription(tenantId: string): Promise<TenantSubscription>;
    cancelSubscription(tenantId: string): Promise<void>;
    updateSubscription(tenantId: string, planId: string): Promise<TenantSubscription>;
    private calculateEndDate;
    private calculateTrialEndDate;
    getProfessionalSubscriptions(professionalId: string): Promise<TenantSubscription[]>;
}
//# sourceMappingURL=SubscriptionService1.d.ts.map