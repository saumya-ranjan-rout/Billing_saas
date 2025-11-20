import { Subscription, SubscriptionStatus } from '../../entities/Subscription';
import { SubscriptionPlan } from '../../entities/SubscriptionPlan';
import { Payment, PaymentGateway } from '../../entities/Payment';
import { Tenant } from '../../entities/Tenant';
export declare class SubscriptionService {
    private subscriptionRepository;
    private planRepository;
    private paymentRepository;
    private userRepository;
    constructor();
    initializeDefaultPlans(): Promise<boolean>;
    getActivePlans(): Promise<SubscriptionPlan[]>;
    createSubscription(userId: string, planId: string, paymentGateway?: PaymentGateway): Promise<{
        subscription: Subscription;
        payment: Payment;
    }>;
    activateFreeTrial(subscriptionId: string): Promise<void>;
    processPaymentSuccess(paymentId: string, gatewayPaymentId: string, gatewayResponse: Record<string, any>): Promise<{
        subscription: Subscription;
        payment: Payment;
    }>;
    cancelSubscription(userId: string): Promise<Subscription>;
    getUserSubscription(userId: string): Promise<Subscription | null>;
    getUserSubscriptionHistory(userId: string, tenantId?: string): Promise<any[]>;
    private updateUserLimits;
    getSubscriptionStats(tenantId: string): Promise<any>;
    createTenantSubscription(data: {
        tenantId: string;
        planId: string;
        paymentGateway?: PaymentGateway;
        status?: SubscriptionStatus;
        startDate?: Date;
        endDate?: Date;
    }): Promise<Subscription>;
    cancelAllSubscriptions(tenantId: string): Promise<Subscription[]>;
    getPlanById(planId: string): Promise<SubscriptionPlan | null>;
    createSubscriptionAfterPayment(userId: string, tenantId: string, planId: string, razorpayPaymentId: string, razorpayOrderId: string): Promise<{
        subscription: Subscription;
        payment: Payment;
    }>;
    professionalOnboardsTenant(professionalId: string, tenantData: any, planId: string, paymentMethodId: string): Promise<{
        tenant: Tenant;
        subscription: Subscription;
    }>;
    getProfessionalSubscriptions(professionalId: string): Promise<Subscription[]>;
    subscribeTenant(tenantId: string, planId: string, paymentMethodId: string, professionalId?: string): Promise<Subscription>;
    getSubscriptionPlans(): Promise<SubscriptionPlan[]>;
    checkAccess(userId: string, tenantId: string): Promise<boolean>;
    markPaymentFailed(paymentId: string, reason: string): Promise<boolean>;
}
//# sourceMappingURL=SubscriptionService.d.ts.map