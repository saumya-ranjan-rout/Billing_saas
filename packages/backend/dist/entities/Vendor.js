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
exports.Vendor = exports.VendorType = void 0;
const typeorm_1 = require("typeorm");
const BaseEntity_1 = require("./BaseEntity");
const Tenant_1 = require("./Tenant");
const PurchaseOrder_1 = require("./PurchaseOrder");
const PaymentInvoice_1 = require("./PaymentInvoice");
var VendorType;
(function (VendorType) {
    VendorType["SUPPLIER"] = "supplier";
    VendorType["SERVICE_PROVIDER"] = "service_provider";
    VendorType["CONTRACTOR"] = "contractor";
})(VendorType = exports.VendorType || (exports.VendorType = {}));
let Vendor = class Vendor extends BaseEntity_1.TenantAwareEntity {
};
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Vendor.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: VendorType, default: VendorType.SUPPLIER }),
    __metadata("design:type", String)
], Vendor.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Vendor.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Vendor.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Vendor.prototype, "billingAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Vendor.prototype, "shippingAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Vendor.prototype, "gstin", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Vendor.prototype, "pan", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Vendor.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Vendor.prototype, "outstandingBalance", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Vendor.prototype, "paymentTerms", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], Vendor.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: {} }),
    __metadata("design:type", Object)
], Vendor.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Tenant_1.Tenant, tenant => tenant.vendors),
    (0, typeorm_1.JoinColumn)({ name: 'tenantId' }),
    __metadata("design:type", Tenant_1.Tenant)
], Vendor.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => PurchaseOrder_1.PurchaseOrder, (purchaseOrder) => purchaseOrder.vendor),
    __metadata("design:type", Array)
], Vendor.prototype, "purchaseOrders", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => PaymentInvoice_1.PaymentInvoice, payment => payment.vendor),
    __metadata("design:type", Array)
], Vendor.prototype, "payments", void 0);
Vendor = __decorate([
    (0, typeorm_1.Entity)('vendors')
], Vendor);
exports.Vendor = Vendor;
//# sourceMappingURL=Vendor.js.map