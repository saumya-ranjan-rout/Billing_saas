import { TenantAwareEntity } from './BaseEntity';
import { Tenant } from './Tenant';
import { Customer } from './Customer';
import { InvoiceItem } from './InvoiceItem';
import { PaymentInvoice } from './PaymentInvoice';
import { Subscription } from './Subscription';
import { GSTIN } from './GSTIN';
import { TaxDetail } from './TaxDetail';
export declare enum InvoiceStatus {
    DRAFT = "draft",
    SENT = "sent",
    VIEWED = "viewed",
    PARTIAL = "partial",
    PAID = "paid",
    OVERDUE = "overdue",
    CANCELLED = "cancelled",
    OPEN = "open",
    PENDING = "pending",
    ISSUED = "issued"
}
export declare enum InvoiceType {
    STANDARD = "standard",
    PROFORMA = "proforma",
    CREDIT = "credit",
    DEBIT = "debit"
}
export declare enum PaymentTerms {
    DUE_ON_RECEIPT = "due_on_receipt",
    NET_7 = "net_7",
    NET_15 = "net_15",
    NET_30 = "net_30",
    NET_60 = "net_60"
}
export declare class Invoice extends TenantAwareEntity {
    invoiceNumber: string;
    type: InvoiceType;
    status: InvoiceStatus;
    customerId: string;
    customer: Customer;
    issueDate: Date;
    dueDate: Date;
    paidDate: Date | null;
    paymentTerms: PaymentTerms;
    shippingAddress: string;
    billingAddress: string;
    termsAndConditions: string;
    notes: string;
    subTotal: number;
    taxTotal: number;
    discountTotal: number;
    totalAmount: number;
    amountPaid: number;
    balanceDue: number;
    taxDetails: TaxDetail[];
    discountDetails: Array<{
        discountType: 'percentage' | 'fixed';
        discountValue: number;
        discountAmount: number;
    }>;
    isRecurring: boolean;
    recurringSettings: {
        frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
        interval: number;
        startDate: Date;
        endDate?: Date;
        totalOccurrences?: number;
    };
    sentAt: Date | null;
    viewedAt: Date | null;
    deletedAt: Date | null;
    tenant: Tenant;
    items: InvoiceItem[];
    payments: PaymentInvoice[];
    gstin: GSTIN;
    subscription: Subscription;
    metadata?: Record<string, any>;
}
//# sourceMappingURL=Invoice.d.ts.map