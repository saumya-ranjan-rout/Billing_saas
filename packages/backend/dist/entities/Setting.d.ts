import { TenantAwareEntity } from "./BaseEntity";
import { Tenant } from "./Tenant";
export declare class Setting extends TenantAwareEntity {
    id: string;
    tenantId: string;
    tenant: Tenant;
    companyName: string;
    subdomain: string;
    contactEmail: string;
    contactPhone: string;
    address: string;
    gstNumber: string;
}
//# sourceMappingURL=Setting.d.ts.map