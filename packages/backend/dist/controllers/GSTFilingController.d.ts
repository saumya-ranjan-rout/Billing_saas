import { Request, Response } from 'express';
export declare class GSTFilingController {
    static getReturn(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static fileReturn(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getFilingHistory(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getComplianceCalendar(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=GSTFilingController.d.ts.map