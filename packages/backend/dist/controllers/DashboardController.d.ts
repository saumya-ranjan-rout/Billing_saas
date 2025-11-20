import { Request, Response } from 'express';
import { DashboardService } from '../services/dashboard/DashboardService';
import { CacheService } from '../services/cache/CacheService';
export declare class DashboardController {
    private readonly dashboardService;
    private readonly cacheService;
    constructor(dashboardService: DashboardService, cacheService: CacheService);
    getDashboardData(req: Request, res: Response): Promise<void>;
    refreshDashboard(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=DashboardController.d.ts.map