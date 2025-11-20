import { TenantAwareEntity } from './BaseEntity';
import { Subscription } from './Subscription';
import { Invoice } from './Invoice';
import { User } from './User';
export declare enum PaymentStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    FAILED = "failed",
    REFUNDED = "refunded"
}
export declare enum PaymentGateway {
    RAZORPAY = "razorpay",
    STRIPE = "stripe",
    CASHFREE = "cashfree",
    MANUAL = "manual"
}
export declare class Payment extends TenantAwareEntity {
    userId: string;
    user: User;
    subscriptionId: string;
    subscription: Subscription;
    amount: number;
    currency: string;
    status: PaymentStatus;
    gateway: PaymentGateway;
    gatewayPaymentId: string;
    gatewayOrderId: string;
    gatewayResponse: Record<string, any>;
    description: string;
    paidAt: Date;
    refundedAt: Date;
    deletedAt: Date;
    invoiceId: string;
    invoice: Invoice;
    failureReason?: string;
    razorpayPaymentId: string;
}
//# sourceMappingURL=Payment.d.ts.map