import { Request, Response } from 'express';
import { AuthService } from '../services/auth/AuthService';
import { Tenant } from "../entities/Tenant";
export declare class AuthController {
    private authService;
    private tenantRepo;
    constructor(authService: AuthService, tenantRepo?: import("typeorm").Repository<Tenant>);
    registerWithTenant(req: Request, res: Response): Promise<void>;
    meWithTenant(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    login(req: Request, res: Response): Promise<void>;
    superUserlogin(req: Request, res: Response): Promise<void>;
    register(req: Request, res: Response): Promise<void>;
    refreshToken(req: Request, res: Response): Promise<void>;
    logout(req: Request, res: Response): Promise<void>;
    enableBiometric: (req: Request, res: Response) => Promise<void>;
    getTenantsForUser: (req: Request, res: Response) => Promise<void>;
    getTenants: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=AuthController.d.ts.map