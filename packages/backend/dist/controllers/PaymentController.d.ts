import { Request, Response } from 'express';
export declare class OptimizedPaymentController {
    private static paymentRepository;
    private static invoiceRepository;
    private static cacheService;
    static list(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static create(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static get(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static delete(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getPaymentMethodsSummary(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=PaymentController.d.ts.map