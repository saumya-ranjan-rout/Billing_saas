import { Request, Response, NextFunction } from "express";
export declare const rbacMiddleware: (permissions: string[]) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=rbac.d.ts.map