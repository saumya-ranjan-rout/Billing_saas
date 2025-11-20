import { Request, Response } from 'express';
import { VendorService } from '../services/vendor/VendorService';
import { CacheService } from '../services/cache/CacheService';
export declare class VendorController {
    private vendorService;
    private cacheService;
    constructor(vendorService: VendorService, cacheService: CacheService);
    createVendor(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getVendor(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getVendors(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    updateVendor(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    deleteVendor(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    searchVendors(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=VendorController.d.ts.map