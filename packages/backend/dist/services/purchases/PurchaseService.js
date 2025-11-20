"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseService = void 0;
const typeorm_1 = require("typeorm");
const database_1 = require("../../config/database");
const PurchaseOrder_1 = require("../../entities/PurchaseOrder");
const PurchaseItem_1 = require("../../entities/PurchaseItem");
const Vendor_1 = require("../../entities/Vendor");
const Product_1 = require("../../entities/Product");
const logger_1 = __importDefault(require("../../utils/logger"));
class PurchaseService {
    constructor() {
        this.purchaseOrderRepository = database_1.AppDataSource.getRepository(PurchaseOrder_1.PurchaseOrder);
        this.purchaseItemRepository = database_1.AppDataSource.getRepository(PurchaseItem_1.PurchaseItem);
        this.vendorRepository = database_1.AppDataSource.getRepository(Vendor_1.Vendor);
        this.productRepository = database_1.AppDataSource.getRepository(Product_1.Product);
    }
    generatePONumber(tenantId) {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `PO-${tenantId.slice(-4)}-${timestamp}-${random}`;
    }
    calculateItemTotals(item) {
        const discountAmount = (item.unitPrice * item.quantity * item.discount) / 100;
        const taxableAmount = (item.unitPrice * item.quantity) - discountAmount;
        const taxAmount = (taxableAmount * item.taxRate) / 100;
        const lineTotal = taxableAmount + taxAmount;
        return {
            discountAmount,
            taxAmount,
            lineTotal,
            receivedQuantity: 0,
            isReceived: false
        };
    }
    async createPurchaseOrder(tenantId, purchaseData) {
        const queryRunner = database_1.AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const vendor = await this.vendorRepository.findOne({
                where: { id: purchaseData.vendorId, tenantId, deletedAt: (0, typeorm_1.IsNull)() }
            });
            if (!vendor) {
                throw new Error('Vendor not found');
            }
            const poNumber = this.generatePONumber(tenantId);
            let subTotal = 0;
            let taxTotal = 0;
            let discountTotal = 0;
            const taxDetails = [];
            const items = await Promise.all(purchaseData.items.map(async (itemData) => {
                const itemTotals = this.calculateItemTotals(itemData);
                subTotal += itemData.unitPrice * itemData.quantity;
                discountTotal += itemTotals.discountAmount;
                taxTotal += itemTotals.taxAmount;
                const existingTax = taxDetails.find(t => t.taxRate === itemData.taxRate);
                if (existingTax) {
                    existingTax.taxAmount += itemTotals.taxAmount;
                }
                else {
                    taxDetails.push({
                        taxName: `Tax ${itemData.taxRate}%`,
                        taxRate: itemData.taxRate,
                        taxAmount: itemTotals.taxAmount
                    });
                }
                const purchaseItem = this.purchaseItemRepository.create({
                    ...itemData,
                    ...itemTotals,
                    tenantId
                });
                return purchaseItem;
            }));
            const totalAmount = subTotal - discountTotal + taxTotal;
            const purchaseOrder = this.purchaseOrderRepository.create({
                poNumber,
                vendorId: purchaseData.vendorId,
                type: purchaseData.type,
                orderDate: purchaseData.orderDate,
                expectedDeliveryDate: purchaseData.expectedDeliveryDate,
                shippingAddress: purchaseData.shippingAddress,
                billingAddress: purchaseData.billingAddress,
                termsAndConditions: purchaseData.termsAndConditions,
                notes: purchaseData.notes,
                subTotal,
                taxTotal,
                discountTotal,
                totalAmount,
                balanceDue: totalAmount,
                taxDetails,
                items,
                tenantId
            });
            const savedPO = await queryRunner.manager.save(purchaseOrder);
            vendor.outstandingBalance = Number(vendor.outstandingBalance) + totalAmount;
            await queryRunner.manager.save(vendor);
            await queryRunner.commitTransaction();
            return savedPO;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            logger_1.default.error('Error creating purchase order:', error);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async getPurchaseOrder(tenantId, poId) {
        try {
            const purchaseOrder = await this.purchaseOrderRepository.findOne({
                where: { id: poId, tenantId, deletedAt: (0, typeorm_1.IsNull)() },
                relations: ['vendor', 'items', 'items.product']
            });
            if (!purchaseOrder) {
                throw new Error('Purchase order not found');
            }
            return purchaseOrder;
        }
        catch (error) {
            logger_1.default.error('Error fetching purchase order:', error);
            throw error;
        }
    }
    async getPurchaseOrders(tenantId, options) {
        try {
            const { page, limit, search, status, vendorId } = options;
            const skip = (page - 1) * limit;
            let whereConditions = { tenantId, deletedAt: (0, typeorm_1.IsNull)() };
            if (status) {
                whereConditions.status = status;
            }
            if (vendorId) {
                whereConditions.vendorId = vendorId;
            }
            if (search) {
                whereConditions = [
                    { ...whereConditions, poNumber: (0, typeorm_1.ILike)(`%${search}%`) },
                    { ...whereConditions, 'vendor.name': (0, typeorm_1.ILike)(`%${search}%`) }
                ];
            }
            const [purchaseOrders, total] = await this.purchaseOrderRepository.findAndCount({
                where: whereConditions,
                relations: ['vendor'],
                skip,
                take: limit,
                order: { createdAt: 'DESC' }
            });
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
    async updatePurchaseOrder(tenantId, poId, updates) {
        try {
            const purchaseOrder = await this.getPurchaseOrder(tenantId, poId);
            if (purchaseOrder.status !== PurchaseOrder_1.PurchaseOrderStatus.DRAFT) {
                throw new Error('Only draft purchase orders can be modified');
            }
            await this.purchaseItemRepository.delete({ purchaseOrder: { id: poId } });
            const newItems = updates.items?.map((item) => {
                const discountAmount = (item.unitPrice * item.quantity * (item.discount ?? 0)) / 100;
                const taxableAmount = (item.unitPrice * item.quantity) - discountAmount;
                const taxAmount = (taxableAmount * (item.taxRate ?? 0)) / 100;
                const lineTotal = taxableAmount + taxAmount;
                return this.purchaseItemRepository.create({
                    ...item,
                    tenantId,
                    discountAmount,
                    taxAmount,
                    lineTotal,
                    purchaseOrder,
                });
            });
            Object.assign(purchaseOrder, {
                ...updates,
                tenantId,
                items: newItems,
            });
            return await this.purchaseOrderRepository.save(purchaseOrder);
        }
        catch (error) {
            logger_1.default.error('Error updating purchase order:', error);
            throw error;
        }
    }
    async updatePurchaseOrderStatus(tenantId, poId, status) {
        const queryRunner = database_1.AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const purchaseOrder = await this.getPurchaseOrder(tenantId, poId);
            if (status === PurchaseOrder_1.PurchaseOrderStatus.RECEIVED && purchaseOrder.status !== PurchaseOrder_1.PurchaseOrderStatus.ORDERED) {
                throw new Error('Only ordered purchase orders can be marked as received');
            }
            purchaseOrder.status = status;
            if (status === PurchaseOrder_1.PurchaseOrderStatus.RECEIVED) {
                purchaseOrder.actualDeliveryDate = new Date();
                for (const item of purchaseOrder.items) {
                    if (item.productId && purchaseOrder.type === PurchaseOrder_1.PurchaseOrderType.PRODUCT) {
                        const product = await this.productRepository.findOne({
                            where: { id: item.productId, tenantId }
                        });
                        if (product) {
                            product.stockQuantity = Number(product.stockQuantity) + Number(item.quantity);
                            await queryRunner.manager.save(product);
                        }
                    }
                }
            }
            const updatedPO = await queryRunner.manager.save(purchaseOrder);
            await queryRunner.commitTransaction();
            return updatedPO;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            logger_1.default.error('Error updating purchase order status:', error);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async deletePurchaseOrder(tenantId, poId) {
        try {
            const purchaseOrder = await this.getPurchaseOrder(tenantId, poId);
            if (purchaseOrder.status !== PurchaseOrder_1.PurchaseOrderStatus.DRAFT) {
                throw new Error('Only draft purchase orders can be deleted');
            }
            purchaseOrder.deletedAt = new Date();
            await this.purchaseOrderRepository.save(purchaseOrder);
        }
        catch (error) {
            logger_1.default.error('Error deleting purchase order:', error);
            throw error;
        }
    }
    async getVendorPurchaseOrders(tenantId, vendorId) {
        try {
            const purchaseOrders = await this.purchaseOrderRepository.find({
                where: { tenantId, vendorId, deletedAt: (0, typeorm_1.IsNull)() },
                relations: ['items'],
                order: { createdAt: 'DESC' }
            });
            return purchaseOrders;
        }
        catch (error) {
            logger_1.default.error('Error fetching vendor purchase orders:', error);
            throw error;
        }
    }
    async getPurchaseOrderSummary(tenantId) {
        try {
            const summary = await this.purchaseOrderRepository
                .createQueryBuilder('po')
                .select('po.status', 'status')
                .addSelect('COUNT(po.id)', 'count')
                .addSelect('SUM(po.totalAmount)', 'totalAmount')
                .where('po.tenantId = :tenantId', { tenantId })
                .andWhere('po.deletedAt IS NULL')
                .groupBy('po.status')
                .getRawMany();
            return summary;
        }
        catch (error) {
            logger_1.default.error('Error fetching purchase order summary:', error);
            throw error;
        }
    }
}
exports.PurchaseService = PurchaseService;
//# sourceMappingURL=PurchaseService.js.map