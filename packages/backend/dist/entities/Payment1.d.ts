import { TenantAwareEntity } from './BaseEntity';
import { Subscription } from './Subscription';
import { Tenant } from './Tenant';
import { ProfessionalUser } from './ProfessionalUser';
export declare enum PaymentStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    FAILED = "failed",
    REFUNDED = "refunded",
    CANCELLED = "cancelled"
}
export declare enum PaymentMethod {
    CARD = "card",
    NETBANKING = "netbanking",
    UPI = "upi",
    WALLET = "wallet",
    BANK_TRANSFER = "bank_transfer"
}
export declare class Payment extends TenantAwareEntity {
    subscriptionId: string;
    subscription: Subscription;
    tenantId: string;
    tenant: Tenant;
    professionalId: string;
    professional: ProfessionalUser;
    amount: number;
    currency: string;
    status: PaymentStatus;
    method: PaymentMethod;
    paymentDate: Date;
    gatewayPaymentId: string;
    gatewayOrderId: string;
    gatewayResponse: Record<string, any>;
    invoiceId: string;
    receipt: string;
    notes: string;
    refundDetails: Record<string, any>;
    refundedAt: Date;
    deletedAt?: Date;
}
//# sourceMappingURL=Payment1.d.ts.map