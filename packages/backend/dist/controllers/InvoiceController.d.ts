import { Request, Response } from 'express';
import { InvoiceService } from '../services/invoice/InvoiceService';
import { SettingService } from '../services/SettingService';
import { CacheService } from '../services/cache/CacheService';
import { QueueService } from '../services/queue/QueueService';
import { LoyaltyService } from '../services/loyalty/LoyaltyService';
export declare class InvoiceController {
    private invoiceService;
    private settingService;
    private cacheService;
    private queueService;
    private loyaltyService;
    constructor(invoiceService: InvoiceService, settingService: SettingService, cacheService: CacheService, queueService: QueueService, loyaltyService: LoyaltyService);
    list(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    get(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    createInvoice(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    updateInvoice(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getInvoice(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getInvoices(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    updateInvoiceStatus(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    addPayment(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    deleteInvoice(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    bulkCreateInvoices(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getCustomerInvoices(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getOverdueInvoices(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getInvoiceSummary(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    sendInvoice(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getSalesReport: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    getGSTR1Report: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    getInvoicePDF: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=InvoiceController.d.ts.map