import { Tenant } from './Tenant';
import { Product } from './Product';
export declare class TaxRate {
    id: string;
    name: string;
    rate: number;
    isActive: boolean;
    description: string;
    tenant: Tenant;
    tenantId: string;
    product: Product;
    productId: string;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=TaxRate.d.ts.map