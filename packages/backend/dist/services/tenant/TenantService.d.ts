import { Tenant, TenantStatus } from '../../entities/Tenant';
import { BaseService } from '../BaseService';
export declare class TenantService extends BaseService<Tenant> {
    private stripeService;
    constructor();
    createTenant(data: Partial<Tenant>): Promise<Tenant>;
    updateTenantStatus(id: string, status: TenantStatus): Promise<Tenant>;
    getTenantBySlug(slug: string): Promise<Tenant>;
    getTenantUsage(tenantId: string): Promise<{
        userCount: number;
        invoiceCount: number;
        customerCount: number;
    }>;
    getTenantById(id: string): Promise<Tenant>;
    updateTenant(id: string, updates: Partial<Tenant>): Promise<Tenant>;
}
//# sourceMappingURL=TenantService.d.ts.map