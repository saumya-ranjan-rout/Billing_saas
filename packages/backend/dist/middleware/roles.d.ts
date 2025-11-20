import { Request, Response, NextFunction } from 'express';
export declare enum UserRole {
    SUPER_ADMIN = "super_admin",
    ADMIN = "admin",
    USER = "user",
    VIEWER = "viewer"
}
export declare const requireRole: (allowedRoles: string[]) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const requirePermission: (permissions: string | string[]) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=roles.d.ts.map