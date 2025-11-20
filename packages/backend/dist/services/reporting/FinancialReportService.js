"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinancialReportService = void 0;
const typeorm_1 = require("typeorm");
const Invoice_1 = require("../../entities/Invoice");
const database_1 = require("../../config/database");
class FinancialReportService {
    constructor() {
        this.invoiceRepository = database_1.AppDataSource.getRepository(Invoice_1.Invoice);
    }
    async generateFinancialReport(tenantId, startDate, endDate) {
        const invoices = await this.invoiceRepository.find({
            where: {
                tenantId,
                issueDate: (0, typeorm_1.Between)(startDate, endDate),
            },
            relations: ['customer', 'items'],
        });
        const totalRevenue = invoices.reduce((sum, inv) => sum + Number(inv.totalAmount), 0);
        const totalTax = invoices.reduce((sum, inv) => sum + Number(inv.taxTotal), 0);
        const totalInvoices = invoices.length;
        const paidInvoices = invoices.filter(inv => inv.status === Invoice_1.InvoiceStatus.PAID).length;
        const overdueInvoices = invoices.filter(inv => inv.status === Invoice_1.InvoiceStatus.OVERDUE).length;
        const revenueByTaxRate = this.calculateRevenueByTaxRate(invoices);
        const revenueByCustomer = this.calculateRevenueByCustomer(invoices);
        return {
            period: `${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`,
            totalRevenue,
            totalTax,
            totalInvoices,
            paidInvoices,
            overdueInvoices,
            revenueByTaxRate,
            revenueByCustomer,
        };
    }
    calculateRevenueByTaxRate(invoices) {
        const taxGroups = new Map();
        invoices.forEach(invoice => {
            invoice.items.forEach(item => {
                const rate = Number(item.taxRate);
                if (!taxGroups.has(rate)) {
                    taxGroups.set(rate, { revenue: 0, tax: 0 });
                }
                const group = taxGroups.get(rate);
                if (group) {
                    group.revenue += Number(item.lineTotal);
                    group.tax += Number(item.taxAmount);
                }
            });
        });
        return [...taxGroups.entries()].map(([rate, { revenue, tax }]) => ({
            rate,
            revenue,
            tax,
        }));
    }
    calculateRevenueByCustomer(invoices) {
        const customerGroups = new Map();
        invoices.forEach(invoice => {
            const customerId = invoice.customer.id;
            const customerName = invoice.customer.name;
            if (!customerGroups.has(customerId)) {
                customerGroups.set(customerId, { customerName, revenue: 0, invoices: 0 });
            }
            const group = customerGroups.get(customerId);
            if (group) {
                group.revenue += Number(invoice.totalAmount);
                group.invoices += 1;
            }
        });
        return [...customerGroups.entries()].map(([customerId, { customerName, revenue, invoices }]) => ({
            customerId,
            customerName,
            revenue,
            invoices,
        }));
    }
}
exports.FinancialReportService = FinancialReportService;
//# sourceMappingURL=FinancialReportService.js.map