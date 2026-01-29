import cors from 'cors';
import { Request, Response, NextFunction } from 'express';
export declare const securityMiddleware: (((req: cors.CorsRequest, res: {
    statusCode?: number | undefined;
    setHeader(key: string, value: string): any;
    end(): any;
}, next: (err?: any) => any) => void) | import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>> | ((req: Request & {
    tenantId?: string;
}, res: Response, next: NextFunction) => Promise<void>))[];
//# sourceMappingURL=security.d.ts.map