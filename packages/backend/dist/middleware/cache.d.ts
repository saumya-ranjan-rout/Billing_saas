import { Request, Response, NextFunction } from 'express';
import { StringValue } from 'ms';
export declare function cacheMiddleware(duration: StringValue): (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
//# sourceMappingURL=cache.d.ts.map