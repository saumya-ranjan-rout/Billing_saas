import { TenantAwareEntity } from './BaseEntity';
import { Tenant } from './Tenant';
import { ProfessionalUser } from './ProfessionalUser';
import { SubscriptionPlan } from './SubscriptionPlan';
import { SubscriptionChange } from './SubscriptionChange';
import { Payment } from './Payment';
export declare enum SubscriptionStatus {
    ACTIVE = "active",
    PENDING = "pending",
    CANCELLED = "cancelled",
    EXPIRED = "expired",
    PAUSED = "paused",
    TRIALING = "trialing"
}
export declare enum PaymentGateway {
    RAZORPAY = "razorpay",
    STRIPE = "stripe",
    PAYPAL = "paypal",
    MANUAL = "manual"
}
export declare enum BillingCycle {
    MONTHLY = "monthly",
    QUARTERLY = "quarterly",
    YEARLY = "yearly"
}
export declare class Subscription extends TenantAwareEntity {
    planId: string;
    plan: SubscriptionPlan;
    tenantId: string;
    tenant: Tenant;
    professionalId: string;
    professional: ProfessionalUser;
    status: SubscriptionStatus;
    amount: number;
    currency: string;
    startDate: Date;
    endDate: Date;
    cancelledAt: Date;
    trialEndsAt: Date;
    paymentGateway: PaymentGateway;
    paymentGatewayId: string;
    paymentGatewaySubscriptionId: string;
    paymentDetails: Record<string, any>;
    metadata: Record<string, any>;
    autoRenew: boolean;
    nextBillingDate: Date;
    cancelAtPeriodEnd: boolean;
    changes: SubscriptionChange[];
    payments: Payment[];
}
//# sourceMappingURL=Subscription1.d.ts.map