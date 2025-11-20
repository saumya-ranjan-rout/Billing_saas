import { TenantAwareEntity } from './BaseEntity';
import { Tenant } from './Tenant';
import { Invoice } from './Invoice';
import { User } from './User';
import { PaymentInvoice } from './PaymentInvoice';
import { LoyaltyTransaction } from "./LoyaltyTransaction";
import { CustomerLoyalty } from "./CustomerLoyalty";
export declare enum CustomerType {
    BUSINESS = "business",
    INDIVIDUAL = "individual"
}
export declare class Customer extends TenantAwareEntity {
    name: string;
    type: CustomerType;
    email: string;
    phone: string;
    billingAddress: {
        line1: string;
        line2?: string;
        city: string;
        state: string;
        country: string;
        pincode: string;
    };
    shippingAddress: {
        line1: string;
        line2?: string;
        city: string;
        state: string;
        country: string;
        pincode: string;
    };
    status: string;
    requestedBy: User;
    requestedTo: User;
    gstin: string;
    pan: string;
    isActive: boolean;
    creditBalance: number;
    deletedAt: Date | null;
    metadata: Record<string, any>;
    tenant: Tenant;
    invoices: Invoice[];
    payments: PaymentInvoice[];
    loyaltyTransactions: LoyaltyTransaction[];
    loyaltyData: CustomerLoyalty[];
    checkSubscription?: "active" | "inactive";
}
//# sourceMappingURL=Customer.d.ts.map