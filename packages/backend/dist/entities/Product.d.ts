import { TenantAwareEntity } from './BaseEntity';
import { Tenant } from './Tenant';
import { Category } from './Category';
import { PurchaseItem } from './PurchaseItem';
import { InvoiceItem } from './InvoiceItem';
import { HSN } from './HSN';
import { TaxRate } from './TaxRate';
export declare enum ProductType {
    GOODS = "goods",
    SERVICE = "service",
    DIGITAL = "digital"
}
export declare enum StockStatus {
    IN_STOCK = "in_stock",
    LOW_STOCK = "low_stock",
    OUT_OF_STOCK = "out_of_stock",
    DISCONTINUED = "discontinued"
}
export declare class Product extends TenantAwareEntity {
    name: string;
    description: string;
    type: ProductType;
    sku: string;
    hsnCode: string;
    costPrice: number;
    sellingPrice: number;
    stockQuantity: number;
    lowStockThreshold: number;
    stockStatus: StockStatus;
    unit: string;
    taxRates: TaxRate[];
    taxRate: number;
    categoryId: string;
    category: Category;
    images: string[];
    isActive: boolean;
    deletedAt: Date | null;
    metadata: Record<string, any>;
    tenant: Tenant;
    purchaseItems: PurchaseItem[];
    invoiceItems: InvoiceItem[];
    hsn: HSN;
    hsnId: string;
}
//# sourceMappingURL=Product.d.ts.map