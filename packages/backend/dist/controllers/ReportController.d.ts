import { Request, Response } from 'express';
import { ReportService } from '../services/report/ReportService';
import { QueueService } from '../services/queue/QueueService';
import { CacheService } from '../services/cache/CacheService';
export declare function getErrorMessage(error: unknown): string;
export declare class ReportController {
    private reportService;
    private queueService;
    private cacheService;
    constructor(reportService: ReportService, queueService: QueueService, cacheService: CacheService);
    generateReport(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getReportStatus(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    downloadReport(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    private getContentType;
    getReportHistory(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getReportById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getReportData(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    deleteReport(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    generateGSTR1(req: Request, res: Response): Promise<void>;
    generateGSTR3B(req: Request, res: Response): Promise<void>;
    generateSalesRegister(req: Request, res: Response): Promise<void>;
    generatePurchaseRegister(req: Request, res: Response): Promise<void>;
    generateHSNSummary(req: Request, res: Response): Promise<void>;
    generateTDSReport(req: Request, res: Response): Promise<void>;
    generateAuditTrail(req: Request, res: Response): Promise<void>;
    generateProfitLoss(req: Request, res: Response): Promise<void>;
    generateBalanceSheet(req: Request, res: Response): Promise<void>;
    generateCashBankBook(req: Request, res: Response): Promise<void>;
    generateLedgerReport(req: Request, res: Response): Promise<void>;
    private generateSpecificReport;
}
//# sourceMappingURL=ReportController.d.ts.map