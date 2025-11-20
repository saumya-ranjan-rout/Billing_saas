"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseOrderService = void 0;
const database_1 = require("../../config/database");
const PurchaseOrder_1 = require("../../entities/PurchaseOrder");
const PurchaseOrderItem_1 = require("../../entities/PurchaseOrderItem");
const VendorService_1 = require("./VendorService");
const logger_1 = __importDefault(require("../../utils/logger"));
class PurchaseOrderService {
    constructor() {
        this.poRepository = database_1.AppDataSource.getRepository(PurchaseOrder_1.PurchaseOrder);
        this.poItemRepository = database_1.AppDataSource.getRepository(PurchaseOrderItem_1.PurchaseOrderItem);
        this.vendorService = new VendorService_1.VendorService();
    }
    async createPurchaseOrder(tenantId, poData) {
        try {
            await this.vendorService.getVendor(tenantId, poData.vendorId);
            const { subtotal, taxAmount, totalAmount } = await this.calculatePOTotals(poData.items);
            const poNumber = this.generatePONumber();
            const purchaseOrder = this.poRepository.create({
                ...poData,
                poNumber,
                subtotal,
                taxAmount,
                totalAmount,
                tenantId,
                status: PurchaseOrder_1.PurchaseOrderStatus.DRAFT
            });
            const savedPO = await this.poRepository.save(purchaseOrder);
            const po = Array.isArray(savedPO) ? savedPO[0] : savedPO;
            if (poData.items && poData.items.length > 0) {
                const items = poData.items.map((item) => ({
                    ...item,
                    purchaseOrderId: po.id
                }));
                await this.poItemRepository.save(items);
            }
            return await this.getPurchaseOrder(tenantId, po.id);
        }
        catch (error) {
            logger_1.default.error('Error creating purchase order:', error);
            throw error;
        }
    }
    async getPurchaseOrder(tenantId, poId) {
        try {
            const po = await this.poRepository.findOne({
                where: { id: poId, tenantId },
                relations: ['vendor', 'items']
            });
            if (!po) {
                throw new Error('Purchase order not found');
            }
            return po;
        }
        catch (error) {
            logger_1.default.error('Error fetching purchase order:', error);
            throw error;
        }
    }
    async getPurchaseOrders(tenantId, options) {
        try {
            const { page, limit, status, vendorId, startDate, endDate } = options;
            const skip = (page - 1) * limit;
            let query = this.poRepository
                .createQueryBuilder('po')
                .leftJoinAndSelect('po.vendor', 'vendor')
                .where('po.tenantId = :tenantId', { tenantId });
            if (status) {
                query = query.andWhere('po.status = :status', { status });
            }
            if (vendorId) {
                query = query.andWhere('po.vendorId = :vendorId', { vendorId });
            }
            if (startDate) {
                query = query.andWhere('po.orderDate >= :startDate', { startDate });
            }
            if (endDate) {
                query = query.andWhere('po.orderDate <= :endDate', { endDate });
            }
            const [purchaseOrders, total] = await query
                .skip(skip)
                .take(limit)
                .orderBy('po.orderDate', 'DESC')
                .getManyAndCount();
            return {
                data: purchaseOrders,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            };
        }
        catch (error) {
            logger_1.default.error('Error fetching purchase orders:', error);
            throw error;
        }
    }
    async updatePurchaseOrderStatus(tenantId, poId, status) {
        try {
            await this.poRepository.update({ id: poId, tenantId }, { status });
            return await this.getPurchaseOrder(tenantId, poId);
        }
        catch (error) {
            logger_1.default.error('Error updating purchase order status:', error);
            throw error;
        }
    }
    async deletePurchaseOrder(tenantId, poId) {
        try {
            await this.poRepository.delete({ id: poId, tenantId });
        }
        catch (error) {
            logger_1.default.error('Error deleting purchase order:', error);
            throw error;
        }
    }
    async calculatePOTotals(items) {
        const subtotal = items.reduce((sum, item) => {
            return sum + (item.quantity * item.unitPrice);
        }, 0);
        const taxAmount = items.reduce((sum, item) => {
            return sum + (item.quantity * item.unitPrice * (item.taxRate / 100));
        }, 0);
        const totalAmount = subtotal + taxAmount;
        return { subtotal, taxAmount, totalAmount };
    }
    generatePONumber() {
        const timestamp = new Date().getTime();
        const random = Math.floor(Math.random() * 1000);
        return `PO-${timestamp}-${random}`;
    }
}
exports.PurchaseOrderService = PurchaseOrderService;
//# sourceMappingURL=PurchaseOrderService.js.map