import { Tenant } from './Tenant';
import { Product } from './Product';
import { InvoiceItem } from './InvoiceItem';
export declare class HSN {
    id: number;
    code: string;
    description: string;
    gstRate: number;
    cessRate?: number;
    isActive: boolean;
    tenantId: string;
    tenant: Tenant;
    products: Product[];
    invoiceItems: InvoiceItem[];
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=HSN.d.ts.map