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
exports.PaymentInvoice = exports.PaymentType = exports.PaymentStatus = exports.PaymentMethod = void 0;
const typeorm_1 = require("typeorm");
const BaseEntity_1 = require("./BaseEntity");
const Tenant_1 = require("./Tenant");
const Invoice_1 = require("./Invoice");
const Customer_1 = require("./Customer");
const Vendor_1 = require("./Vendor");
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CASH"] = "cash";
    PaymentMethod["BANK_TRANSFER"] = "bank_transfer";
    PaymentMethod["CHEQUE"] = "cheque";
    PaymentMethod["CREDIT_CARD"] = "credit_card";
    PaymentMethod["DEBIT_CARD"] = "debit_card";
    PaymentMethod["UPI"] = "upi";
    PaymentMethod["WALLET"] = "wallet";
    PaymentMethod["OTHER"] = "other";
})(PaymentMethod = exports.PaymentMethod || (exports.PaymentMethod = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "pending";
    PaymentStatus["COMPLETED"] = "completed";
    PaymentStatus["FAILED"] = "failed";
    PaymentStatus["REFUNDED"] = "refunded";
})(PaymentStatus = exports.PaymentStatus || (exports.PaymentStatus = {}));
var PaymentType;
(function (PaymentType) {
    PaymentType["INCOME"] = "income";
    PaymentType["EXPENSE"] = "expense";
})(PaymentType = exports.PaymentType || (exports.PaymentType = {}));
let PaymentInvoice = class PaymentInvoice extends BaseEntity_1.TenantAwareEntity {
};
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PaymentInvoice.prototype, "invoiceId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Invoice_1.Invoice, invoice => invoice.payments),
    (0, typeorm_1.JoinColumn)({ name: 'invoiceId' }),
    __metadata("design:type", Invoice_1.Invoice)
], PaymentInvoice.prototype, "invoice", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PaymentInvoice.prototype, "customerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Customer_1.Customer, customer => customer.payments),
    (0, typeorm_1.JoinColumn)({ name: 'customerId' }),
    __metadata("design:type", Customer_1.Customer)
], PaymentInvoice.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], PaymentInvoice.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: PaymentMethod, default: PaymentMethod.BANK_TRANSFER }),
    __metadata("design:type", String)
], PaymentInvoice.prototype, "method", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING }),
    __metadata("design:type", String)
], PaymentInvoice.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: PaymentType, default: PaymentType.EXPENSE }),
    __metadata("design:type", String)
], PaymentInvoice.prototype, "paymentType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], PaymentInvoice.prototype, "paymentDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PaymentInvoice.prototype, "referenceNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], PaymentInvoice.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], PaymentInvoice.prototype, "paymentDetails", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], PaymentInvoice.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Tenant_1.Tenant, tenant => tenant.payments),
    (0, typeorm_1.JoinColumn)({ name: 'tenantId' }),
    __metadata("design:type", Tenant_1.Tenant)
], PaymentInvoice.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Vendor_1.Vendor, vendor => vendor.payments, { nullable: true }),
    __metadata("design:type", Vendor_1.Vendor)
], PaymentInvoice.prototype, "vendor", void 0);
PaymentInvoice = __decorate([
    (0, typeorm_1.Entity)('payments_invoice')
], PaymentInvoice);
exports.PaymentInvoice = PaymentInvoice;
//# sourceMappingURL=PaymentInvoice.js.map