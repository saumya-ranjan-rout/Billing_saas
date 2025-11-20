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
exports.HSN = void 0;
const typeorm_1 = require("typeorm");
const Tenant_1 = require("./Tenant");
const Product_1 = require("./Product");
const InvoiceItem_1 = require("./InvoiceItem");
let HSN = class HSN {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], HSN.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, name: 'code', nullable: false }),
    __metadata("design:type", String)
], HSN.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', name: 'description', nullable: false }),
    __metadata("design:type", String)
], HSN.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, name: 'gstrate', nullable: false }),
    __metadata("design:type", Number)
], HSN.prototype, "gstRate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, name: 'cessrate', nullable: true }),
    __metadata("design:type", Number)
], HSN.prototype, "cessRate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', name: 'isactive', default: true }),
    __metadata("design:type", Boolean)
], HSN.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'tenantid', nullable: false }),
    __metadata("design:type", String)
], HSN.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Tenant_1.Tenant, (tenant) => tenant.hsnCodes, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'tenantid' }),
    __metadata("design:type", Tenant_1.Tenant)
], HSN.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Product_1.Product, (product) => product.hsn),
    __metadata("design:type", Array)
], HSN.prototype, "products", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => InvoiceItem_1.InvoiceItem, (invoiceItem) => invoiceItem.hsn),
    __metadata("design:type", Array)
], HSN.prototype, "invoiceItems", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        type: 'timestamp',
        name: 'createdat',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], HSN.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        type: 'timestamp',
        name: 'updatedat',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], HSN.prototype, "updatedAt", void 0);
HSN = __decorate([
    (0, typeorm_1.Entity)('hsn_codes')
], HSN);
exports.HSN = HSN;
//# sourceMappingURL=HSN.js.map