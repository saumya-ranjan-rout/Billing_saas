"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseOrder = exports.PurchaseOrderType = exports.PurchaseOrderStatus = void 0;
const typeorm_1 = require("typeorm");
const BaseEntity_1 = require("./BaseEntity");
const Tenant_1 = require("./Tenant");
const Vendor_1 = require("./Vendor");
const PurchaseItem_1 = require("./PurchaseItem");
var PurchaseOrderStatus;
(function (PurchaseOrderStatus) {
    PurchaseOrderStatus["DRAFT"] = "draft";
    PurchaseOrderStatus["PENDING"] = "pending";
    PurchaseOrderStatus["APPROVED"] = "approved";
    PurchaseOrderStatus["ORDERED"] = "ordered";
    PurchaseOrderStatus["RECEIVED"] = "received";
    PurchaseOrderStatus["CANCELLED"] = "cancelled";
    PurchaseOrderStatus["PAID"] = "paid";
})(PurchaseOrderStatus = exports.PurchaseOrderStatus || (exports.PurchaseOrderStatus = {}));
var PurchaseOrderType;
(function (PurchaseOrderType) {
    PurchaseOrderType["PRODUCT"] = "product";
    PurchaseOrderType["SERVICE"] = "service";
    PurchaseOrderType["EXPENSE"] = "expense";
})(PurchaseOrderType = exports.PurchaseOrderType || (exports.PurchaseOrderType = {}));
let PurchaseOrder = class PurchaseOrder extends BaseEntity_1.TenantAwareEntity {
};
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "poNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: PurchaseOrderStatus, default: PurchaseOrderStatus.DRAFT }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: PurchaseOrderType, default: PurchaseOrderType.PRODUCT }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "vendorId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Vendor_1.Vendor, vendor => vendor.purchaseOrders),
    (0, typeorm_1.JoinColumn)({ name: 'vendorId' }),
    __metadata("design:type", Vendor_1.Vendor)
], PurchaseOrder.prototype, "vendor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], PurchaseOrder.prototype, "orderDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], PurchaseOrder.prototype, "expectedDeliveryDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], PurchaseOrder.prototype, "actualDeliveryDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "shippingAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "billingAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "termsAndConditions", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], PurchaseOrder.prototype, "subTotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], PurchaseOrder.prototype, "taxTotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], PurchaseOrder.prototype, "discountTotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], PurchaseOrder.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], PurchaseOrder.prototype, "amountPaid", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], PurchaseOrder.prototype, "balanceDue", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], PurchaseOrder.prototype, "taxDetails", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], PurchaseOrder.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Tenant_1.Tenant, tenant => tenant.purchaseOrders),
    (0, typeorm_1.JoinColumn)({ name: 'tenantId' }),
    __metadata("design:type", Tenant_1.Tenant)
], PurchaseOrder.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => PurchaseItem_1.PurchaseItem, purchaseItem => purchaseItem.purchaseOrder, {
        cascade: true,
        eager: true
    }),
    __metadata("design:type", Array)
], PurchaseOrder.prototype, "items", void 0);
PurchaseOrder = __decorate([
    (0, typeorm_1.Entity)('purchase_orders')
], PurchaseOrder);
exports.PurchaseOrder = PurchaseOrder;
//# sourceMappingURL=PurchaseOrder.js.map