import { Request, Response, NextFunction } from 'express';
export declare const validateTenantAccess: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const extractTenantFromSubdomain: (req: Request, res: Response, next: NextFunction) => void;
export declare const resolveTenantFromSubdomain: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const requireTenantAdmin: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateTenantResource: (resourceType: string, idParam?: string) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const validateTenantUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=tenant.middleware.d.ts.map