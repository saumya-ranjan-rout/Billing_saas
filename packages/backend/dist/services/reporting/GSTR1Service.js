"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GSTR1Service = void 0;
const typeorm_1 = require("typeorm");
const Invoice_1 = require("../../entities/Invoice");
const database_1 = require("../../config/database");
const GSTCalculationService_1 = require("../billing/GSTCalculationService");
class GSTR1Service {
    constructor() {
        this.invoiceRepository = database_1.AppDataSource.getRepository(Invoice_1.Invoice);
        this.gstCalculationService = new GSTCalculationService_1.GSTCalculationService();
    }
    async generateGSTR1Report(tenantId, period) {
        const [month, year] = period.split('-');
        const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
        const endDate = new Date(parseInt(year), parseInt(month), 0);
        const invoices = await this.invoiceRepository.find({
            where: {
                tenantId,
                issueDate: (0, typeorm_1.Between)(startDate, endDate),
                status: (0, typeorm_1.In)([Invoice_1.InvoiceStatus.ISSUED, Invoice_1.InvoiceStatus.PAID]),
            },
            relations: ['items', 'customer', 'gstin'],
        });
        return this.gstCalculationService.calculateGSTR1Report(tenantId, period);
    }
    async generateGSTR1JSON(tenantId, period) {
        const report = await this.generateGSTR1Report(tenantId, period);
        return JSON.stringify(report, null, 2);
    }
    async generateGSTR1Excel(tenantId, period) {
        const report = await this.generateGSTR1Report(tenantId, period);
        return Buffer.from('');
    }
}
exports.GSTR1Service = GSTR1Service;
//# sourceMappingURL=GSTR1Service.js.map