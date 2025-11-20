import { TenantAwareEntity } from './BaseEntity';
import { PurchaseOrder } from './PurchaseOrder';
import { Product } from './Product';
export declare class PurchaseItem extends TenantAwareEntity {
    purchaseOrderId: string;
    purchaseOrder: PurchaseOrder;
    productId: string;
    product: Product;
    description: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    discount: number;
    discountAmount: number;
    taxRate: number;
    taxAmount: number;
    lineTotal: number;
    receivedQuantity: number;
    isReceived: boolean;
}
//# sourceMappingURL=PurchaseItem.d.ts.map