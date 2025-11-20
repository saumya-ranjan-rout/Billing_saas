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
exports.Product = exports.StockStatus = exports.ProductType = void 0;
const typeorm_1 = require("typeorm");
const BaseEntity_1 = require("./BaseEntity");
const Tenant_1 = require("./Tenant");
const Category_1 = require("./Category");
const PurchaseItem_1 = require("./PurchaseItem");
const InvoiceItem_1 = require("./InvoiceItem");
const HSN_1 = require("./HSN");
const TaxRate_1 = require("./TaxRate");
var ProductType;
(function (ProductType) {
    ProductType["GOODS"] = "goods";
    ProductType["SERVICE"] = "service";
    ProductType["DIGITAL"] = "digital";
})(ProductType = exports.ProductType || (exports.ProductType = {}));
var StockStatus;
(function (StockStatus) {
    StockStatus["IN_STOCK"] = "in_stock";
    StockStatus["LOW_STOCK"] = "low_stock";
    StockStatus["OUT_OF_STOCK"] = "out_of_stock";
    StockStatus["DISCONTINUED"] = "discontinued";
})(StockStatus = exports.StockStatus || (exports.StockStatus = {}));
let Product = class Product extends BaseEntity_1.TenantAwareEntity {
};
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Product.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ProductType, default: ProductType.GOODS }),
    __metadata("design:type", String)
], Product.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "sku", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "hsnCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], Product.prototype, "costPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], Product.prototype, "sellingPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "stockQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "lowStockThreshold", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: StockStatus, default: StockStatus.IN_STOCK }),
    __metadata("design:type", String)
], Product.prototype, "stockStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "unit", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => TaxRate_1.TaxRate, (taxRate) => taxRate.product, { cascade: true }),
    __metadata("design:type", Array)
], Product.prototype, "taxRates", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "taxRate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "categoryId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Category_1.Category, category => category.products, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'categoryId' }),
    __metadata("design:type", Category_1.Category)
], Product.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], Product.prototype, "images", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Product.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], Product.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: {} }),
    __metadata("design:type", Object)
], Product.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Tenant_1.Tenant, tenant => tenant.products),
    (0, typeorm_1.JoinColumn)({ name: 'tenantId' }),
    __metadata("design:type", Tenant_1.Tenant)
], Product.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => PurchaseItem_1.PurchaseItem, purchaseItem => purchaseItem.product),
    __metadata("design:type", Array)
], Product.prototype, "purchaseItems", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => InvoiceItem_1.InvoiceItem, invoiceItem => invoiceItem.product),
    __metadata("design:type", Array)
], Product.prototype, "invoiceItems", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => HSN_1.HSN, (hsn) => hsn.products, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'hsnId' }),
    __metadata("design:type", HSN_1.HSN)
], Product.prototype, "hsn", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "hsnId", void 0);
Product = __decorate([
    (0, typeorm_1.Entity)('products')
], Product);
exports.Product = Product;
//# sourceMappingURL=Product.js.map