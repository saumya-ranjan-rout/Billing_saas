import { TenantAwareEntity } from './BaseEntity';
import { Tenant } from './Tenant';
import { PurchaseOrder } from './PurchaseOrder';
import { PaymentInvoice } from './PaymentInvoice';
export declare enum VendorType {
    SUPPLIER = "supplier",
    SERVICE_PROVIDER = "service_provider",
    CONTRACTOR = "contractor"
}
export declare class Vendor extends TenantAwareEntity {
    name: string;
    type: VendorType;
    email: string;
    phone: string;
    billingAddress: {
        line1: string;
        line2?: string;
        city: string;
        state: string;
        country: string;
        postalCode: string;
    };
    shippingAddress: {
        line1: string;
        line2?: string;
        city: string;
        state: string;
        country: string;
        postalCode: string;
    };
    gstin: string;
    pan: string;
    isActive: boolean;
    outstandingBalance: number;
    paymentTerms: string;
    deletedAt: Date | null;
    metadata: Record<string, any>;
    tenant: Tenant;
    purchaseOrders: PurchaseOrder[];
    payments: PaymentInvoice[];
}
//# sourceMappingURL=Vendor.d.ts.map