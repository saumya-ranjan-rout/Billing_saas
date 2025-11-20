/// <reference types="node" />
/// <reference types="node" />
import { Invoice, InvoiceStatus, InvoiceType } from '../../entities/Invoice';
import { Setting } from '../../entities/Setting';
import { PaymentInvoice } from '../../entities/PaymentInvoice';
import { Customer } from '../../entities/Customer';
import { PaginatedResponse } from '../../types/customTypes';
import { TaxDetail } from '../../entities/TaxDetail';
export declare class InvoiceService {
    private invoiceRepository;
    private invoiceItemRepository;
    private paymentRepository;
    private customerRepository;
    private productRepository;
    private taxDetailRepository;
    private loyaltyService;
    private cacheService;
    constructor();
    getInvoicesWithKeysetPagination(tenantId: string, options: {
        cursor?: string;
        limit?: number;
        search?: string;
        status?: InvoiceStatus;
        customerId?: string;
        startDate?: Date;
        endDate?: Date;
    }): Promise<{
        data: Invoice[];
        nextCursor: string | null;
        hasMore: boolean;
    }>;
    getInvoiceWithDetails(tenantId: string, invoiceId: string): Promise<Invoice>;
    getInvoicesForListView(tenantId: string, options: {
        page?: number;
        limit?: number;
        search?: string;
        status?: InvoiceStatus;
        customerId?: string;
    }): Promise<{
        data: Invoice[];
        total: number;
    }>;
    private safeNumber;
    private roundToTwoDecimals;
    private generateInvoiceNumber;
    private calculateDueDate;
    private calculateItemTotals;
    private safeProcessLoyalty;
    createInvoice(tenantId: string, invoiceData: any): Promise<Invoice>;
    updateInvoice(tenantId: string, invoiceId: string, invoiceData: any): Promise<Invoice>;
    getInvoice(tenantId: string, invoiceId: string): Promise<Invoice>;
    getInvoices(tenantId: string, options: {
        page: number;
        limit: number;
        search?: string;
        status?: InvoiceStatus;
        type?: InvoiceType;
        customerId?: string;
        startDate?: Date;
        endDate?: Date;
    }): Promise<PaginatedResponse<Invoice>>;
    updateInvoiceStatus(tenantId: string, invoiceId: string, status: InvoiceStatus): Promise<Invoice>;
    addPayment(tenantId: string, paymentData: Partial<PaymentInvoice>): Promise<PaymentInvoice>;
    deleteInvoice(tenantId: string, invoiceId: string): Promise<void>;
    getOrCreateCustomerByEmail(tenantId: string, name?: string, email?: string): Promise<Customer>;
    getCustomerInvoices(tenantId: string, customerId: string): Promise<Invoice[]>;
    getOverdueInvoices(tenantId: string): Promise<Invoice[]>;
    getInvoiceSummary(tenantId: string): Promise<any>;
    sendInvoice(tenantId: string, invoiceId: string): Promise<Invoice>;
    getSalesReport(tenantId: string, { startDate, endDate }: {
        startDate?: string;
        endDate?: string;
    }): Promise<{
        totalInvoices: number;
        totalSales: number;
        totalTax: number;
        totalDiscount: number;
        data: {
            invoiceNumber: string;
            customerName: string;
            issueDate: Date;
            totalAmount: number;
            taxTotal: number;
            discountTotal: number;
            status: InvoiceStatus;
        }[];
    }>;
    getGSTR1Report(tenantId: string, { startDate, endDate }: {
        startDate?: string;
        endDate?: string;
    }): Promise<{
        summary: {
            totalInvoices: number;
            totalTaxableValue: number;
            totalTaxAmount: number;
            totalCessAmount: number;
            b2bCount: number;
        };
        b2bInvoices: {
            invoiceNumber: string;
            issueDate: Date;
            customerName: string;
            customerGSTIN: string;
            gstinUsed: string;
            taxableValue: number;
            taxAmount: number;
            totalAmount: number;
            taxDetails: TaxDetail[];
        }[];
        data: {
            invoiceNumber: string;
            issueDate: Date;
            customerName: string;
            customerGSTIN: string;
            gstinUsed: string;
            totalAmount: number;
            taxDetails: TaxDetail[];
            category: string;
        }[];
    }>;
    generateInvoicePDF(invoice: Invoice, setting: Setting): Promise<Buffer>;
    bulkCreateInvoices(tenantId: string, invoicesData: any[]): Promise<Invoice[]>;
}
//# sourceMappingURL=InvoiceService.d.ts.map