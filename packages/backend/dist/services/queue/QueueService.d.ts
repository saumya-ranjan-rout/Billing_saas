import { Job } from 'bullmq';
export declare enum JobType {
    GENERATE_REPORT = "generate_report",
    SEND_BULK_INVOICES = "send_bulk_invoices",
    SYNC_GST_DATA = "sync_gst_data",
    SEND_NOTIFICATION = "send_notification"
}
export declare class QueueService {
    private redis;
    private reportQueue;
    private notificationQueue;
    private reportService;
    private invoiceService;
    constructor();
    private setupWorkers;
    queueReportGeneration(tenantId: string, reportType: string, format: string, filters: any, reportId: string): Promise<Job<any, any, string>>;
    queueNotification(type: string, userId: string, data: any): Promise<Job<any, any, string>>;
    private sendNotification;
}
//# sourceMappingURL=QueueService.d.ts.map