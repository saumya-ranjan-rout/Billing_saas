import { Request, Response } from 'express';
export declare class SuperAdminController {
    static getDashboard(req: Request, res: Response): Promise<void>;
    static getUsers(req: Request, res: Response): Promise<void>;
    static createUser(req: Request, res: Response): Promise<void>;
    static updateUser(req: Request, res: Response): Promise<void>;
    static createTenant(req: Request, res: Response): Promise<void>;
    static updateTenant(req: Request, res: Response): Promise<void>;
    static getUserById(req: Request, res: Response): Promise<void>;
    static getTenants(req: Request, res: Response): Promise<void>;
    static getSubscriptions(req: Request, res: Response): Promise<void>;
    static createProfessional(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static updateProfessional(req: Request, res: Response): Promise<void>;
    static getProfessionals(req: Request, res: Response): Promise<void>;
    static updateProfessionalStatus(req: Request, res: Response): Promise<void>;
    static getAuditLogs(req: Request, res: Response): Promise<void>;
    static exportData(req: Request, res: Response): Promise<void>;
    static updateUserStatus(req: Request, res: Response): Promise<void>;
    static updateTenantStatus(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=SuperAdminController.d.ts.map