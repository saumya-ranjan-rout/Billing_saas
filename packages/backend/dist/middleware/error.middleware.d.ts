import { Request, Response, NextFunction } from 'express';
export declare const asyncErrorHandler: (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => (req: Request, res: Response, next: NextFunction) => void;
export declare const errorHandler: (error: any, req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=error.middleware.d.ts.map