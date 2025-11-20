import { Request, Response } from 'express';
import { PurchaseService } from '../services/purchases/PurchaseService';
export declare class PurchaseController {
    private purchaseService;
    constructor(purchaseService: PurchaseService);
    createPurchaseOrder(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getPurchaseOrder(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getPurchaseOrders(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    updatePurchaseOrder(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    updatePurchaseOrderStatus(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    deletePurchaseOrder(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getVendorPurchaseOrders(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getPurchaseOrderSummary(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=PurchaseController.d.ts.map