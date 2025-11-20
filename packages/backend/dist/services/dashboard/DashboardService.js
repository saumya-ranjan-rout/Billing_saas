"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const typeorm_1 = require("typeorm");
const database_1 = require("../../config/database");
const Invoice_1 = require("../../entities/Invoice");
const Customer_1 = require("../../entities/Customer");
const CacheService_1 = require("../cache/CacheService");
class DashboardService {
    constructor() {
        this.cacheService = new CacheService_1.CacheService();
    }
    async getDashboardData(tenantId) {
        const cacheKey = CacheService_1.CacheService.Keys.tenantDashboard(tenantId);
        return await this.cacheService.getOrSet(cacheKey, async () => {
            const today = new Date();
            const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
            const yearStart = new Date(today.getFullYear(), 0, 1);
            const aggregate = await database_1.AppDataSource.getRepository(Invoice_1.Invoice)
                .createQueryBuilder('invoice')
                .select([
                `COUNT(*)::int AS total_invoices`,
                `SUM(CASE WHEN invoice.status = 'pending' THEN 1 ELSE 0 END)::int AS pending_invoices`,
                `SUM(CASE WHEN invoice.issueDate >= :monthStart THEN invoice.totalAmount ELSE 0 END)::numeric AS monthly_revenue`,
                `SUM(CASE WHEN invoice.issueDate >= :yearStart THEN invoice.totalAmount ELSE 0 END)::numeric AS yearly_revenue`
            ])
                .where('invoice.tenantId = :tenantId', { tenantId })
                .andWhere('invoice.deletedAt IS NULL')
                .setParameters({ monthStart, yearStart })
                .getRawOne();
            const totalCustomers = await database_1.AppDataSource.getRepository(Customer_1.Customer).count({
                where: { tenantId, deletedAt: (0, typeorm_1.IsNull)() },
            });
            const recentInvoices = await database_1.AppDataSource.getRepository(Invoice_1.Invoice).find({
                where: { tenantId, deletedAt: (0, typeorm_1.IsNull)() },
                relations: ['customer'],
                take: 5,
                order: { createdAt: 'DESC' },
            });
            const pendingInvoices = await database_1.AppDataSource.getRepository(Invoice_1.Invoice).find({
                where: {
                    tenantId,
                    status: Invoice_1.InvoiceStatus.PENDING,
                    deletedAt: (0, typeorm_1.IsNull)()
                },
                relations: ['customer'],
                take: 5,
                order: { dueDate: 'ASC' },
            });
            const overdueInvoices = await database_1.AppDataSource.getRepository(Invoice_1.Invoice)
                .createQueryBuilder('invoice')
                .leftJoinAndSelect('invoice.customer', 'customer')
                .where('invoice.tenantId = :tenantId', { tenantId })
                .andWhere('invoice.dueDate < :today', { today })
                .andWhere('invoice.status IN (:...statuses)', {
                statuses: ['sent', 'viewed', 'partial'],
            })
                .andWhere('invoice.deletedAt IS NULL')
                .orderBy('invoice.dueDate', 'ASC')
                .take(5)
                .getMany();
            return {
                summary: {
                    totalInvoices: Number(aggregate?.total_invoices || 0),
                    totalCustomers,
                    monthlyRevenue: parseFloat(aggregate?.monthly_revenue || '0'),
                    yearlyRevenue: parseFloat(aggregate?.yearly_revenue || '0'),
                    pendingInvoices: Number(aggregate?.pending_invoices || 0),
                    overdueInvoices: overdueInvoices.length,
                },
                recentInvoices,
                pendingInvoices,
                overdueInvoices,
                charts: {
                    monthlyRevenue: await this.getMonthlyRevenueChart(tenantId),
                    invoiceStatus: await this.getInvoiceStatusChart(tenantId),
                },
            };
        }, 300);
    }
    async getTotalInvoices(tenantId) {
        const repo = database_1.AppDataSource.getRepository(Invoice_1.Invoice);
        return await repo.count({
            where: { tenantId, deletedAt: (0, typeorm_1.IsNull)() }
        });
    }
    async getTotalCustomers(tenantId) {
        const repo = database_1.AppDataSource.getRepository(Customer_1.Customer);
        return await repo.count({
            where: { tenantId, deletedAt: (0, typeorm_1.IsNull)() }
        });
    }
    async getRevenue(tenantId, from, to) {
        const repo = database_1.AppDataSource.getRepository(Invoice_1.Invoice);
        const result = await repo
            .createQueryBuilder('invoice')
            .select('SUM(invoice.totalAmount)', 'total')
            .where('invoice.tenantId = :tenantId', { tenantId })
            .andWhere('invoice.issueDate BETWEEN :from AND :to', { from, to })
            .andWhere('invoice.deletedAt IS NULL')
            .getRawOne();
        return parseFloat(result?.total || '0');
    }
    async getPendingInvoices(tenantId) {
        const repo = database_1.AppDataSource.getRepository(Invoice_1.Invoice);
        return await repo.find({
            where: {
                tenantId,
                status: Invoice_1.InvoiceStatus.PENDING,
                deletedAt: (0, typeorm_1.IsNull)()
            },
            relations: ['customer'],
            take: 10,
            order: { dueDate: 'ASC' }
        });
    }
    async getRecentInvoices(tenantId) {
        const repo = database_1.AppDataSource.getRepository(Invoice_1.Invoice);
        return await repo.find({
            where: { tenantId, deletedAt: (0, typeorm_1.IsNull)() },
            relations: ['customer'],
            take: 5,
            order: { createdAt: 'DESC' }
        });
    }
    async getOverdueInvoices(tenantId) {
        const repo = database_1.AppDataSource.getRepository(Invoice_1.Invoice);
        const today = new Date();
        return await repo
            .createQueryBuilder('invoice')
            .where('invoice.tenantId = :tenantId', { tenantId })
            .andWhere('invoice.dueDate < :today', { today })
            .andWhere('invoice.status IN (:...statuses)', {
            statuses: ['sent', 'viewed', 'partial']
        })
            .andWhere('invoice.deletedAt IS NULL')
            .leftJoinAndSelect('invoice.customer', 'customer')
            .orderBy('invoice.dueDate', 'ASC')
            .take(10)
            .getMany();
    }
    async getMonthlyRevenueChart(tenantId) {
        return [];
    }
    async getInvoiceStatusChart(tenantId) {
        return [];
    }
}
exports.DashboardService = DashboardService;
//# sourceMappingURL=DashboardService.js.map