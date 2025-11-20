"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptimizedPaymentController = void 0;
const typeorm_1 = require("typeorm");
const database_1 = require("../config/database");
const Payment_1 = require("../entities/Payment");
const Invoice_1 = require("../entities/Invoice");
const CacheService_1 = require("../services/cache/CacheService");
const logger_1 = __importDefault(require("../utils/logger"));
const response_1 = require("../utils/response");
class OptimizedPaymentController {
    static async list(req, res) {
        try {
            const tenantId = req.tenantId;
            const { page = 1, limit = 20, invoiceId, customerId, startDate, endDate } = req.query;
            const cacheKey = `payments:${tenantId}:${page}:${limit}:${invoiceId}:${customerId}:${startDate}:${endDate}`;
            const payments = await this.cacheService.getOrSet(cacheKey, async () => {
                const skip = (Number(page) - 1) * Number(limit);
                const where = { tenantId, deletedAt: (0, typeorm_1.IsNull)() };
                if (invoiceId) {
                    where.invoiceId = invoiceId;
                }
                if (customerId) {
                    where.customerId = customerId;
                }
                if (startDate && endDate) {
                    where.paymentDate = (0, typeorm_1.Between)(new Date(startDate), new Date(endDate));
                }
                const [data, total] = await this.paymentRepository.findAndCount({
                    where,
                    relations: ['invoice', 'customer'],
                    order: { createdAt: 'DESC' },
                    skip,
                    take: Number(limit),
                });
                return {
                    data,
                    pagination: {
                        page: Number(page),
                        limit: Number(limit),
                        total,
                        pages: Math.ceil(total / Number(limit))
                    }
                };
            }, 300);
            return (0, response_1.ok)(res, payments);
        }
        catch (error) {
            logger_1.default.error('Error fetching payments:', error);
            return (0, response_1.errorResponse)(res, 'Failed to fetch payments');
        }
    }
    static async create(req, res) {
        const queryRunner = database_1.AppDataSource.createQueryRunner();
        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();
            const tenantId = req.tenantId;
            const { invoiceId, amount, ...paymentData } = req.body;
            const invoice = await this.invoiceRepository.findOne({
                where: { id: invoiceId, tenantId, deletedAt: (0, typeorm_1.IsNull)() }
            });
            if (!invoice) {
                return (0, response_1.errorResponse)(res, 'Invoice not found', 404);
            }
            if (amount <= 0) {
                return (0, response_1.errorResponse)(res, 'Payment amount must be greater than 0', 400);
            }
            if (amount > invoice.balanceDue) {
                return (0, response_1.errorResponse)(res, 'Payment amount exceeds invoice balance due', 400);
            }
            const payment = this.paymentRepository.create({
                ...paymentData,
                amount,
                invoiceId,
                customerId: invoice.customerId,
                tenantId,
            });
            const savedPayment = await queryRunner.manager.save(payment);
            const paymentEntity = Array.isArray(savedPayment)
                ? savedPayment[0]
                : savedPayment;
            const paymentId = paymentEntity.id;
            invoice.balanceDue -= amount;
            if (invoice.balanceDue <= 0) {
                invoice.status = Invoice_1.InvoiceStatus.PAID;
                invoice.paidDate = new Date();
            }
            else if (invoice.balanceDue < invoice.totalAmount) {
                invoice.status = Invoice_1.InvoiceStatus.PARTIAL;
            }
            await queryRunner.manager.save(invoice);
            await this.cacheService.invalidatePattern(`payments:${tenantId}:*`);
            await this.cacheService.del(`invoice:${tenantId}:${invoiceId}`);
            await this.cacheService.invalidatePattern(`cache:${tenantId}:/api/invoices*`);
            await this.cacheService.invalidatePattern(`customer:${tenantId}:${invoice.customerId}`);
            await this.cacheService.invalidatePattern(`cache:${tenantId}:/api/customers*`);
            await this.cacheService.invalidatePattern(`dashboard:${tenantId}`);
            await queryRunner.commitTransaction();
            logger_1.default.info(`Payment created: ${paymentId} for invoice: ${invoiceId}`);
            return (0, response_1.ok)(res, savedPayment);
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            logger_1.default.error('Error creating payment:', error);
            return (0, response_1.errorResponse)(res, 'Failed to create payment');
        }
        finally {
            await queryRunner.release();
        }
    }
    static async get(req, res) {
        try {
            const tenantId = req.tenantId;
            const { id } = req.params;
            const cacheKey = `payment:${tenantId}:${id}`;
            const payment = await this.cacheService.getOrSet(cacheKey, async () => {
                return await this.paymentRepository.findOne({
                    where: { id, tenantId, deletedAt: (0, typeorm_1.IsNull)() },
                    relations: ['invoice', 'customer'],
                });
            }, 600);
            if (!payment) {
                return (0, response_1.errorResponse)(res, 'Payment not found', 404);
            }
            return (0, response_1.ok)(res, payment);
        }
        catch (error) {
            logger_1.default.error('Error fetching payment:', error);
            return (0, response_1.errorResponse)(res, 'Failed to fetch payment');
        }
    }
    static async delete(req, res) {
        const queryRunner = database_1.AppDataSource.createQueryRunner();
        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();
            const tenantId = req.tenantId;
            const { id } = req.params;
            const payment = await this.paymentRepository.findOne({
                where: { id, tenantId, deletedAt: (0, typeorm_1.IsNull)() },
                relations: ['invoice'],
            });
            if (!payment) {
                return (0, response_1.errorResponse)(res, 'Payment not found', 404);
            }
            const invoice = payment.invoice;
            invoice.balanceDue += payment.amount;
            if (invoice.balanceDue === invoice.totalAmount) {
                invoice.status = Invoice_1.InvoiceStatus.PENDING;
                invoice.paidDate = null;
            }
            else if (invoice.balanceDue > 0) {
                invoice.status = Invoice_1.InvoiceStatus.PARTIAL;
            }
            payment.deletedAt = new Date();
            await queryRunner.manager.save(invoice);
            await queryRunner.manager.save(payment);
            await this.cacheService.del(`payment:${tenantId}:${id}`);
            await this.cacheService.invalidatePattern(`payments:${tenantId}:*`);
            await this.cacheService.del(`invoice:${tenantId}:${invoice.id}`);
            await this.cacheService.invalidatePattern(`cache:${tenantId}:/api/invoices*`);
            await this.cacheService.invalidatePattern(`dashboard:${tenantId}`);
            await queryRunner.commitTransaction();
            logger_1.default.info(`Payment deleted: ${id}`);
            return (0, response_1.ok)(res, { message: 'Payment deleted successfully' });
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            logger_1.default.error('Error deleting payment:', error);
            return (0, response_1.errorResponse)(res, 'Failed to delete payment');
        }
        finally {
            await queryRunner.release();
        }
    }
    static async getPaymentMethodsSummary(req, res) {
        try {
            const tenantId = req.tenantId;
            const { startDate, endDate } = req.query;
            const cacheKey = `payments:methods:${tenantId}:${startDate}:${endDate}`;
            const summary = await this.cacheService.getOrSet(cacheKey, async () => {
                const query = this.paymentRepository
                    .createQueryBuilder('payment')
                    .select('payment.method', 'method')
                    .addSelect('SUM(payment.amount)', 'totalAmount')
                    .addSelect('COUNT(payment.id)', 'count')
                    .where('payment.tenantId = :tenantId', { tenantId })
                    .andWhere('payment.deletedAt IS NULL');
                if (startDate && endDate) {
                    query.andWhere('payment.paymentDate BETWEEN :startDate AND :endDate', {
                        startDate: new Date(startDate),
                        endDate: new Date(endDate),
                    });
                }
                return await query
                    .groupBy('payment.method')
                    .orderBy('totalAmount', 'DESC')
                    .getRawMany();
            }, 600);
            return (0, response_1.ok)(res, summary);
        }
        catch (error) {
            logger_1.default.error('Error fetching payment methods summary:', error);
            return (0, response_1.errorResponse)(res, 'Failed to fetch payment methods summary');
        }
    }
}
exports.OptimizedPaymentController = OptimizedPaymentController;
OptimizedPaymentController.paymentRepository = database_1.AppDataSource.getRepository(Payment_1.Payment);
OptimizedPaymentController.invoiceRepository = database_1.AppDataSource.getRepository(Invoice_1.Invoice);
OptimizedPaymentController.cacheService = new CacheService_1.CacheService();
//# sourceMappingURL=PaymentController.js.map