import { Request, Response } from "express";
import { TenantService } from "../services/tenant/TenantService";
import { TenantProvisioningService } from "../services/tenant/TenantProvisioningService";
import { CacheService } from "../services/cache/CacheService";
export declare class TenantController {
    private readonly tenantService;
    private readonly provisioningService;
    private readonly cacheService;
    constructor(tenantService: TenantService, provisioningService: TenantProvisioningService, cacheService: CacheService);
    createTenant(req: Request, res: Response): Promise<void>;
    getTenantDetails(req: Request, res: Response): Promise<void>;
    updateTenant(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=TenantController.d.ts.map