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
exports.GSTIN = void 0;
const typeorm_1 = require("typeorm");
const Tenant_1 = require("./Tenant");
const Invoice_1 = require("./Invoice");
let GSTIN = class GSTIN {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], GSTIN.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, name: 'gstin', nullable: false }),
    __metadata("design:type", String)
], GSTIN.prototype, "gstin", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, name: 'legalname', nullable: false }),
    __metadata("design:type", String)
], GSTIN.prototype, "legalName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, name: 'tradename', nullable: false }),
    __metadata("design:type", String)
], GSTIN.prototype, "tradeName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', name: 'address', nullable: false }),
    __metadata("design:type", Object)
], GSTIN.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10, name: 'statecode', nullable: false }),
    __metadata("design:type", String)
], GSTIN.prototype, "stateCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', name: 'isactive', default: true }),
    __metadata("design:type", Boolean)
], GSTIN.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', name: 'isprimary', default: false }),
    __metadata("design:type", Boolean)
], GSTIN.prototype, "isPrimary", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', name: 'authstatus', nullable: true }),
    __metadata("design:type", Object)
], GSTIN.prototype, "authStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'tenantId', nullable: false }),
    __metadata("design:type", String)
], GSTIN.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Tenant_1.Tenant, (tenant) => tenant.gstins, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'tenantId' }),
    __metadata("design:type", Tenant_1.Tenant)
], GSTIN.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Invoice_1.Invoice, (invoice) => invoice.gstin),
    __metadata("design:type", Array)
], GSTIN.prototype, "invoices", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        type: 'timestamp',
        name: 'createdAt',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], GSTIN.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        type: 'timestamp',
        name: 'updatedAt',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], GSTIN.prototype, "updatedAt", void 0);
GSTIN = __decorate([
    (0, typeorm_1.Entity)('gstins')
], GSTIN);
exports.GSTIN = GSTIN;
//# sourceMappingURL=GSTIN.js.map