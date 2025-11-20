import { PlanType } from "../../entities/SubscriptionPlan";
import { Subscription, SubscriptionStatus } from "../../entities/Subscription";
import { Payment } from "../../entities/Payment";
import { Tenant } from "../../entities/Tenant";
export declare class BillingService {
    private subscriptionRepo;
    private paymentRepo;
    private planRepo;
    private tenantRepo;
    private razorpayService;
    createSubscription(planType: PlanType, entityId: string, paymentMethod: string): Promise<{
        subscription: Subscription;
        payment: Payment;
    }>;
    handlePaymentSuccess(paymentId: string, razorpayPaymentId: string, razorpayResponse: any): Promise<Payment>;
    handlePaymentFailure(paymentId: string, razorpayResponse: any): Promise<Payment>;
    createProfessionalClientSubscription(professionalId: string, tenantData: any, paymentMethod: string): Promise<{
        tenant: Tenant;
        subscription: Subscription;
        payment: Payment;
    }>;
    checkSubscriptionStatus(entityId: string, planType: PlanType): Promise<{
        status: string;
        active: boolean;
        subscription?: undefined;
    } | {
        status: SubscriptionStatus;
        active: boolean;
        subscription: Subscription;
    }>;
    cancelSubscription(subscriptionId: string): Promise<Subscription>;
    getSubscriptionPayments(subscriptionId: string): Promise<Payment[]>;
}
//# sourceMappingURL=BillingService.d.ts.map