import { TenantAwareEntity } from './BaseEntity';
import { Customer } from './Customer';
import { Invoice } from './Invoice';
import { LoyaltyProgram } from './LoyaltyProgram';
export declare enum TransactionType {
    EARN = "earn",
    REDEEM = "redeem",
    EXPIRY = "expiry",
    ADJUSTMENT = "adjustment"
}
export declare enum TransactionStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    EXPIRED = "expired"
}
export declare class LoyaltyTransaction extends TenantAwareEntity {
    customerId: string;
    customer: Customer;
    invoiceId: string;
    invoice: Invoice;
    programId: string;
    program: LoyaltyProgram;
    type: TransactionType;
    status: TransactionStatus;
    points: number;
    cashbackAmount: number;
    orderAmount: number;
    description: string;
    expiryDate: Date;
    metadata: Record<string, any>;
    effectivePercentage: number;
}
//# sourceMappingURL=LoyaltyTransaction.d.ts.map