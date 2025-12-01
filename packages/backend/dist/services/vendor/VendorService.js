"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorService = void 0;
const typeorm_1 = require("typeorm");
const database_1 = require("../../config/database");
const Vendor_1 = require("../../entities/Vendor");
const validators_1 = require("../../utils/validators");
const logger_1 = __importDefault(require("../../utils/logger"));
const PaymentInvoice_1 = require("../../entities/PaymentInvoice");
const PurchaseOrder_1 = require("../../entities/PurchaseOrder");
class VendorService {
    constructor() {
        this.paymentRepository = database_1.AppDataSource.getRepository(PaymentInvoice_1.PaymentInvoice);
        this.purchaseRepository = database_1.AppDataSource.getRepository(PurchaseOrder_1.PurchaseOrder);
        this.vendorRepository = database_1.AppDataSource.getRepository(Vendor_1.Vendor);
        this.paymentRepository = database_1.AppDataSource.getRepository(PaymentInvoice_1.PaymentInvoice);
        this.purchaseRepository = database_1.AppDataSource.getRepository(PurchaseOrder_1.PurchaseOrder);
    }
    async getVendorBalance(tenantId, vendorId) {
        const totalDueResult = await this.purchaseRepository
            .createQueryBuilder("purchase_orders")
            .select("SUM(purchase_orders.balanceDue)", "totalDue")
            .where("purchase_orders.tenantId = :tenantId", { tenantId })
            .andWhere("purchase_orders.vendorId = :vendorId", { vendorId })
            .getRawOne();
        const totalPaidResult = await this.paymentRepository
            .createQueryBuilder("payment_invoice")
            .select("SUM(payment_invoice.amount)", "totalPaid")
            .where("payment_invoice.tenantId = :tenantId", { tenantId })
            .andWhere("payment_invoice.vendorId = :vendorId", { vendorId })
            .getRawOne();
        const totalDue = Number(totalDueResult?.totalDue ?? 0);
        const totalPaid = Number(totalPaidResult?.totalPaid ?? 0);
        const balance = totalDue - totalPaid;
        return {
            vendorId,
            totalDue,
            totalPaid,
            balance: totalDue - totalPaid
        };
    }
    async recordPayment(data) {
        const { amount, method, vendorId, paymentDate, notes, status, paymentType, tenantId } = data;
        const payment = this.paymentRepository.create({
            amount,
            method,
            vendorId,
            paymentDate,
            notes,
            status,
            paymentType,
            tenantId,
            createdAt: new Date(),
        });
        return await this.paymentRepository.save(payment);
    }
    async getVendorPaymentHistory(tenantId, vendorId) {
        const PaymentHistory = await this.paymentRepository.find({
            where: { tenantId, vendorId, deletedAt: (0, typeorm_1.IsNull)() },
            order: { createdAt: 'DESC' },
        });
        return { PaymentHistory };
    }
    async createVendor(tenantId, vendorData) {
        try {
            if (vendorData.gstin && !(0, validators_1.validateGSTIN)(vendorData.gstin)) {
                throw new Error('Invalid GSTIN format');
            }
            if (vendorData.pan && !(0, validators_1.validatePAN)(vendorData.pan)) {
                throw new Error('Invalid PAN format');
            }
            const existingVendor = await this.vendorRepository.findOne({
                where: { name: vendorData.name, tenantId, deletedAt: (0, typeorm_1.IsNull)() }
            });
            if (existingVendor) {
                throw new Error('Vendor with this name already exists');
            }
            const vendor = this.vendorRepository.create({
                ...vendorData,
                tenantId
            });
            const savedVendor = await this.vendorRepository.save(vendor);
            return savedVendor;
        }
        catch (error) {
            logger_1.default.error('Error creating vendor:', error);
            throw error;
        }
    }
    async getVendor(tenantId, vendorId) {
        try {
            const vendor = await this.vendorRepository.findOne({
                where: { id: vendorId, tenantId, deletedAt: (0, typeorm_1.IsNull)() },
                relations: ['tenant']
            });
            if (!vendor) {
                throw new Error('Vendor not found');
            }
            return vendor;
        }
        catch (error) {
            logger_1.default.error('Error fetching vendor:', error);
            throw error;
        }
    }
    async getVendors(tenantId, options) {
        try {
            const { page, limit, name, email, phone, status, joinedFrom, joinedTo } = options;
            const skip = (page - 1) * limit;
            let whereConditions = { tenantId, deletedAt: (0, typeorm_1.IsNull)() };
            if (options.name) {
                whereConditions.name = (0, typeorm_1.ILike)(`%${options.name}%`);
            }
            if (options.email) {
                whereConditions.email = (0, typeorm_1.ILike)(`%${options.email}%`);
            }
            if (options.phone) {
                whereConditions.phone = (0, typeorm_1.ILike)(`%${options.phone}%`);
            }
            if (options.joinedFrom || options.joinedTo) {
                whereConditions.createdAt = {};
                if (options.joinedFrom) {
                    whereConditions.createdAt = (0, typeorm_1.MoreThanOrEqual)(new Date(options.joinedFrom));
                }
                if (options.joinedTo) {
                    whereConditions.createdAt = (0, typeorm_1.LessThanOrEqual)(new Date(options.joinedTo));
                }
            }
            let [vendors, total] = await this.vendorRepository.findAndCount({
                where: whereConditions,
                skip,
                take: limit,
                order: { createdAt: 'DESC' }
            });
            for (const vendor of vendors) {
                const balance = await this.getVendorBalance(tenantId, vendor.id);
                const totalDueNum = Number(balance.totalDue ?? 0);
                const totalPaidNum = Number(balance.totalPaid ?? 0);
                const balanceNum = Number(balance.balance ?? 0);
                vendor.totalDue = Number(totalDueNum.toFixed(2));
                vendor.totalPaid = Number(totalPaidNum.toFixed(2));
                vendor.balance = Number(balanceNum.toFixed(2));
                if (balanceNum === 0 && totalDueNum > 0) {
                    vendor.paymentStatus = PaymentInvoice_1.PaymentStatus.COMPLETED;
                }
                else if (totalPaidNum > 0 && balanceNum > 0) {
                    vendor.paymentStatus = PaymentInvoice_1.PaymentStatus.PARTIAL;
                    ;
                }
                else {
                    vendor.paymentStatus = PaymentInvoice_1.PaymentStatus.PENDING;
                }
            }
            if (options.status) {
                vendors = vendors.filter(v => v.paymentStatus === options.status);
                total = vendors.length;
            }
            return {
                data: vendors,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            };
        }
        catch (error) {
            logger_1.default.error('Error fetching vendors:', error);
            throw error;
        }
    }
    async updateVendor(tenantId, vendorId, updates) {
        try {
            if (updates.gstin && !(0, validators_1.validateGSTIN)(updates.gstin)) {
                throw new Error('Invalid GSTIN format');
            }
            if (updates.pan && !(0, validators_1.validatePAN)(updates.pan)) {
                throw new Error('Invalid PAN format');
            }
            const vendor = await this.getVendor(tenantId, vendorId);
            if (updates.name && updates.name !== vendor.name) {
                const existingVendor = await this.vendorRepository.findOne({
                    where: { name: updates.name, tenantId, deletedAt: (0, typeorm_1.IsNull)() }
                });
                if (existingVendor && existingVendor.id !== vendorId) {
                    throw new Error('Vendor with this name already exists');
                }
            }
            Object.assign(vendor, updates);
            return await this.vendorRepository.save(vendor);
        }
        catch (error) {
            logger_1.default.error('Error updating vendor:', error);
            throw error;
        }
    }
    async deleteVendor(tenantId, vendorId) {
        try {
            const vendor = await this.getVendor(tenantId, vendorId);
            vendor.deletedAt = new Date();
            await this.vendorRepository.save(vendor);
        }
        catch (error) {
            logger_1.default.error('Error deleting vendor:', error);
            throw error;
        }
    }
    async searchVendors(tenantId, query) {
        try {
            if (!query || query.length < 2) {
                throw new Error('Search query must be at least 2 characters long');
            }
            const vendors = await this.vendorRepository.find({
                where: [
                    { tenantId, name: (0, typeorm_1.ILike)(`%${query}%`), deletedAt: (0, typeorm_1.IsNull)() },
                    { tenantId, email: (0, typeorm_1.ILike)(`%${query}%`), deletedAt: (0, typeorm_1.IsNull)() },
                    { tenantId, phone: (0, typeorm_1.ILike)(`%${query}%`), deletedAt: (0, typeorm_1.IsNull)() },
                    { tenantId, gstin: (0, typeorm_1.ILike)(`%${query}%`), deletedAt: (0, typeorm_1.IsNull)() }
                ],
                take: 10
            });
            return vendors;
        }
        catch (error) {
            logger_1.default.error('Error searching vendors:', error);
            throw error;
        }
    }
    async getVendorByGSTIN(tenantId, gstin) {
        try {
            const vendor = await this.vendorRepository.findOne({
                where: { tenantId, gstin, deletedAt: (0, typeorm_1.IsNull)() }
            });
            return vendor;
        }
        catch (error) {
            logger_1.default.error('Error fetching vendor by GSTIN:', error);
            throw error;
        }
    }
    async updateOutstandingBalance(tenantId, vendorId, amount) {
        try {
            const vendor = await this.getVendor(tenantId, vendorId);
            vendor.outstandingBalance = Number(vendor.outstandingBalance) + amount;
            await this.vendorRepository.save(vendor);
        }
        catch (error) {
            logger_1.default.error('Error updating vendor balance:', error);
            throw error;
        }
    }
}
exports.VendorService = VendorService;
//# sourceMappingURL=VendorService.js.map