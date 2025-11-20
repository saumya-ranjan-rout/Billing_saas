import { Request, Response, NextFunction } from 'express';
import { ProfessionalUser } from '../entities/ProfessionalUser';
export declare const professionalAuth: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
declare global {
    namespace Express {
        interface Request {
            professional?: ProfessionalUser;
        }
    }
}
//# sourceMappingURL=professionalAuth.d.ts.map