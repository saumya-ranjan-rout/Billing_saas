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
exports.Customer = exports.CustomerType = void 0;
const typeorm_1 = require("typeorm");
const BaseEntity_1 = require("./BaseEntity");
const Tenant_1 = require("./Tenant");
const Invoice_1 = require("./Invoice");
const User_1 = require("./User");
const PaymentInvoice_1 = require("./PaymentInvoice");
const LoyaltyTransaction_1 = require("./LoyaltyTransaction");
const CustomerLoyalty_1 = require("./CustomerLoyalty");
var CustomerType;
(function (CustomerType) {
    CustomerType["BUSINESS"] = "business";
    CustomerType["INDIVIDUAL"] = "individual";
})(CustomerType = exports.CustomerType || (exports.CustomerType = {}));
let Customer = class Customer extends BaseEntity_1.TenantAwareEntity {
};
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Customer.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: CustomerType, default: CustomerType.BUSINESS }),
    __metadata("design:type", String)
], Customer.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Customer.prototype, "billingAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Customer.prototype, "shippingAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, { eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'requestedBy' }),
    __metadata("design:type", User_1.User)
], Customer.prototype, "requestedBy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, { eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'requestedTo' }),
    __metadata("design:type", User_1.User)
], Customer.prototype, "requestedTo", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "gstin", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "pan", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Customer.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Customer.prototype, "creditBalance", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], Customer.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: {} }),
    __metadata("design:type", Object)
], Customer.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Tenant_1.Tenant, tenant => tenant.users),
    (0, typeorm_1.JoinColumn)({ name: 'tenantId' }),
    __metadata("design:type", Tenant_1.Tenant)
], Customer.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Invoice_1.Invoice, (invoice) => invoice.customer),
    __metadata("design:type", Array)
], Customer.prototype, "invoices", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => PaymentInvoice_1.PaymentInvoice, (payment) => payment.customer),
    __metadata("design:type", Array)
], Customer.prototype, "payments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => LoyaltyTransaction_1.LoyaltyTransaction, transaction => transaction.customer),
    __metadata("design:type", Array)
], Customer.prototype, "loyaltyTransactions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => CustomerLoyalty_1.CustomerLoyalty, loyalty => loyalty.customer),
    __metadata("design:type", Array)
], Customer.prototype, "loyaltyData", void 0);
Customer = __decorate([
    (0, typeorm_1.Entity)('customers')
], Customer);
exports.Customer = Customer;
//# sourceMappingURL=Customer.js.map