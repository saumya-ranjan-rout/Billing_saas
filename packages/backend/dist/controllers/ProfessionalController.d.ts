import { Request, Response } from 'express';
export declare class ProfessionalController {
    static registerProfessional(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getDashboard(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getManagedTenants(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static assignToTenant(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=ProfessionalController.d.ts.map