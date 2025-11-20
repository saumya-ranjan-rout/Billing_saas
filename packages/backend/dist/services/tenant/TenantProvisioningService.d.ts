import { User } from '../../entities/User';
import { Tenant } from '../../entities/Tenant';
export declare class TenantProvisioningService {
    private tenantService;
    private userService;
    private subscriptionService;
    constructor();
    provisionNewTenant(tenantData: Partial<Tenant>, adminUserData: Partial<User>): Promise<{
        tenant: Tenant;
        adminUser: User;
    }>;
    deprovisionTenant(tenantId: string): Promise<void>;
}
//# sourceMappingURL=TenantProvisioningService.d.ts.map