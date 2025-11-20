import { Request, Response, NextFunction } from 'express';
import { SuperAdmin } from '../entities/SuperAdmin';
export declare const superAdminAuth: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
declare global {
    namespace Express {
        interface Request {
            superAdmin?: SuperAdmin;
        }
    }
}
//# sourceMappingURL=superAdminAuth.d.ts.map