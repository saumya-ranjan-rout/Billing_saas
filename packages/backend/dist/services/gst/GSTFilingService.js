"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GSTFilingService = void 0;
const typeorm_1 = require("typeorm");
const database_1 = require("../../config/database");
const ProfessionalUser_1 = require("../../entities/ProfessionalUser");
const ProfessionalTenant_1 = require("../../entities/ProfessionalTenant");
const Tenant_1 = require("../../entities/Tenant");
const logger_1 = __importDefault(require("../../utils/logger"));
class GSTFilingService {
    constructor() {
        this.professionalRepository = database_1.AppDataSource.getRepository(ProfessionalUser_1.ProfessionalUser);
        this.tenantRepository = database_1.AppDataSource.getRepository(Tenant_1.Tenant);
    }
    async prepareGSTR1(professionalId, tenantId, period) {
        try {
            await this.verifyProfessionalAccess(professionalId, tenantId, "GSTR1");
            const gstr1Data = await this.generateGSTR1Data(tenantId, period);
            return gstr1Data;
        }
        catch (error) {
            logger_1.default.error('Error preparing GSTR-1:', error);
            throw error;
        }
    }
    async prepareGSTR3B(professionalId, tenantId, period) {
        try {
            await this.verifyProfessionalAccess(professionalId, tenantId, "GSTR3B");
            const gstr3bData = await this.generateGSTR3BData(tenantId, period);
            return gstr3bData;
        }
        catch (error) {
            logger_1.default.error('Error preparing GSTR-3B:', error);
            throw error;
        }
    }
    async fileGSTRETurn(professionalId, tenantId, returnType, period, returnData) {
        try {
            await this.verifyProfessionalAccess(professionalId, tenantId, returnType);
            this.validateReturnData(returnData);
            const result = await this.submitToGSTPortal(tenantId, returnType, period, returnData);
            await this.saveFilingRecord(professionalId, tenantId, returnType, period, result);
            return result;
        }
        catch (error) {
            logger_1.default.error('Error filing GST return:', error);
            throw error;
        }
    }
    async getFilingHistory(professionalId, tenantId) {
        try {
            let query = database_1.AppDataSource.getRepository('GSTFiling')
                .createQueryBuilder('filing')
                .leftJoinAndSelect('filing.tenant', 'tenant')
                .where('filing.professionalId = :professionalId', { professionalId });
            if (tenantId) {
                query = query.andWhere('filing.tenantId = :tenantId', { tenantId });
            }
            return query.orderBy('filing.filingDate', 'DESC').getMany();
        }
        catch (error) {
            logger_1.default.error('Error fetching filing history:', error);
            throw error;
        }
    }
    async verifyProfessionalAccess(professionalId, tenantId, returnType) {
        const assignment = await database_1.AppDataSource.getRepository(ProfessionalTenant_1.ProfessionalTenant)
            .findOne({
            where: {
                professionalId,
                tenantId,
                isActive: true
            }
        });
        if (!assignment) {
            throw new Error('Professional does not have access to this tenant');
        }
        if (returnType?.includes('GSTR') && !assignment.specificPermissions?.canFileGST) {
            throw new Error('Professional does not have GST filing permissions for this tenant');
        }
    }
    async generateGSTR1Data(tenantId, period) {
        const invoices = await database_1.AppDataSource.getRepository('Invoice')
            .find({
            where: {
                tenantId,
                invoiceDate: (0, typeorm_1.Between)(this.getPeriodStart(period), this.getPeriodEnd(period))
            }
        });
        return this.transformToGSTR1(invoices);
    }
    async generateGSTR3BData(tenantId, period) {
        return {};
    }
    async submitToGSTPortal(tenantId, returnType, period, returnData) {
        return {
            success: true,
            acknowledgmentNumber: `ACK-${Date.now()}`
        };
    }
    async saveFilingRecord(professionalId, tenantId, returnType, period, result) {
        const filingRecord = {
            professionalId,
            tenantId,
            returnType,
            period,
            filingDate: new Date(),
            acknowledgmentNumber: result.acknowledgmentNumber,
            status: result.success ? 'filed' : 'failed'
        };
        await database_1.AppDataSource.getRepository('GSTFiling').save(filingRecord);
    }
    validateReturnData(returnData) {
        if (!returnData) {
            throw new Error('Return data is required');
        }
    }
    getPeriodStart(period) {
        return new Date();
    }
    getPeriodEnd(period) {
        return new Date();
    }
    transformToGSTR1(invoices) {
        return {
            b2b: this.getB2BInvoices(invoices),
            b2cl: this.getB2CLInvoices(invoices),
        };
    }
    getB2BInvoices(invoices) {
        return invoices.filter(inv => inv.customerGSTIN).map(inv => ({
            ctin: inv.customerGSTIN,
            inv: [{}]
        }));
    }
    getB2CLInvoices(invoices) {
        return invoices.filter(inv => !inv.customerGSTIN && inv.totalAmount > 250000).map(inv => ({}));
    }
}
exports.GSTFilingService = GSTFilingService;
//# sourceMappingURL=GSTFilingService.js.map