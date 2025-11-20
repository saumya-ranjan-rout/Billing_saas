export interface FinancialReport {
    period: string;
    totalRevenue: number;
    totalTax: number;
    totalInvoices: number;
    paidInvoices: number;
    overdueInvoices: number;
    revenueByTaxRate: Array<{
        rate: number;
        revenue: number;
        tax: number;
    }>;
    revenueByCustomer: Array<{
        customerId: string;
        customerName: string;
        revenue: number;
        invoices: number;
    }>;
}
export declare class FinancialReportService {
    private invoiceRepository;
    generateFinancialReport(tenantId: string, startDate: Date, endDate: Date): Promise<FinancialReport>;
    private calculateRevenueByTaxRate;
    private calculateRevenueByCustomer;
}
//# sourceMappingURL=FinancialReportService.d.ts.map