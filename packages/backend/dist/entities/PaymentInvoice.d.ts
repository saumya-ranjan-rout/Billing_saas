import { TenantAwareEntity } from './BaseEntity';
import { Tenant } from './Tenant';
import { Invoice } from './Invoice';
import { Customer } from './Customer';
import { Vendor } from './Vendor';
export declare enum PaymentMethod {
    CASH = "cash",
    BANK_TRANSFER = "bank_transfer",
    CHEQUE = "cheque",
    CREDIT_CARD = "credit_card",
    DEBIT_CARD = "debit_card",
    UPI = "upi",
    WALLET = "wallet",
    OTHER = "other"
}
export declare enum PaymentStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    FAILED = "failed",
    REFUNDED = "refunded"
}
export declare enum PaymentType {
    INCOME = "income",
    EXPENSE = "expense"
}
export declare class PaymentInvoice extends TenantAwareEntity {
    invoiceId: string;
    invoice: Invoice;
    customerId: string;
    customer: Customer;
    amount: number;
    method: PaymentMethod;
    status: PaymentStatus;
    paymentType: PaymentType;
    paymentDate: Date;
    referenceNumber: string;
    notes: string;
    paymentDetails: Record<string, any>;
    deletedAt: Date | null;
    tenant: Tenant;
    vendor?: Vendor;
}
//# sourceMappingURL=PaymentInvoice.d.ts.map