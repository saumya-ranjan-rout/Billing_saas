import { TenantAwareEntity } from './BaseEntity';
import { Tenant } from './Tenant';
import { Product } from './Product';
export declare class Category extends TenantAwareEntity {
    name: string;
    description: string;
    parentId: string;
    parent: Category;
    isActive: boolean;
    deletedAt: Date | null;
    tenant: Tenant;
    children: Category[];
    products: Product[];
}
//# sourceMappingURL=Category.d.ts.map