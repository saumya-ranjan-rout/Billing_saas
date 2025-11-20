import { TenantAwareEntity } from './BaseEntity';
import { Tenant } from './Tenant';
import { Vendor } from './Vendor';
import { PurchaseItem } from './PurchaseItem';
export declare enum PurchaseOrderStatus {
    DRAFT = "draft",
    PENDING = "pending",
    APPROVED = "approved",
    ORDERED = "ordered",
    RECEIVED = "received",
    CANCELLED = "cancelled",
    PAID = "paid"
}
export declare enum PurchaseOrderType {
    PRODUCT = "product",
    SERVICE = "service",
    EXPENSE = "expense"
}
export declare class PurchaseOrder extends TenantAwareEntity {
    poNumber: string;
    status: PurchaseOrderStatus;
    type: PurchaseOrderType;
    vendorId: string;
    vendor: Vendor;
    orderDate: Date;
    expectedDeliveryDate: Date;
    actualDeliveryDate: Date;
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
    taxDetails: Array<{
        taxName: string;
        taxRate: number;
        taxAmount: number;
    }>;
    deletedAt: Date | null;
    tenant: Tenant;
    items: PurchaseItem[];
}
//# sourceMappingURL=PurchaseOrder.d.ts.map