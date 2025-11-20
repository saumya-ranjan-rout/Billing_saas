import { Request, Response } from 'express';
import { LoyaltyService } from '../services/loyalty/LoyaltyService';
export declare class LoyaltyController {
    private loyaltyService;
    constructor(loyaltyService: LoyaltyService);
    processInvoice(req: Request, res: Response): Promise<void>;
    redeemCashback(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getCustomerSummary(req: Request, res: Response): Promise<void>;
    updateProgram(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getProgramStats(req: Request, res: Response): Promise<void>;
    calculateCashback(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getActiveProgram(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=LoyaltyController.d.ts.map