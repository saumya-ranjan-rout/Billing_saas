import { Invoice } from '../../entities/Invoice';
export declare class DashboardService {
    private cacheService;
    constructor();
    getDashboardData(tenantId: string): Promise<{
        summary: {
            totalInvoices: number;
            totalCustomers: number;
            monthlyRevenue: number;
            yearlyRevenue: number;
            pendingInvoices: number;
            overdueInvoices: number;
        };
        recentInvoices: Invoice[];
        pendingInvoices: Invoice[];
        overdueInvoices: Invoice[];
        charts: {
            monthlyRevenue: never[];
            invoiceStatus: never[];
        };
    }>;
    private getTotalInvoices;
    private getTotalCustomers;
    private getRevenue;
    private getPendingInvoices;
    private getRecentInvoices;
    private getOverdueInvoices;
    private getMonthlyRevenueChart;
    private getInvoiceStatusChart;
}
//# sourceMappingURL=DashboardService.d.ts.map