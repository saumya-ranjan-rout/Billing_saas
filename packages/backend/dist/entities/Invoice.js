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
exports.Invoice = exports.PaymentTerms = exports.InvoiceType = exports.InvoiceStatus = void 0;
const typeorm_1 = require("typeorm");
const BaseEntity_1 = require("./BaseEntity");
const Tenant_1 = require("./Tenant");
const Customer_1 = require("./Customer");
const InvoiceItem_1 = require("./InvoiceItem");
const PaymentInvoice_1 = require("./PaymentInvoice");
const Subscription_1 = require("./Subscription");
const GSTIN_1 = require("./GSTIN");
const TaxDetail_1 = require("./TaxDetail");
var InvoiceStatus;
(function (InvoiceStatus) {
    InvoiceStatus["DRAFT"] = "draft";
    InvoiceStatus["SENT"] = "sent";
    InvoiceStatus["VIEWED"] = "viewed";
    InvoiceStatus["PARTIAL"] = "partial";
    InvoiceStatus["PAID"] = "paid";
    InvoiceStatus["OVERDUE"] = "overdue";
    InvoiceStatus["CANCELLED"] = "cancelled";
    InvoiceStatus["OPEN"] = "open";
    InvoiceStatus["PENDING"] = "pending";
    InvoiceStatus["ISSUED"] = "issued";
})(InvoiceStatus = exports.InvoiceStatus || (exports.InvoiceStatus = {}));
var InvoiceType;
(function (InvoiceType) {
    InvoiceType["STANDARD"] = "standard";
    InvoiceType["PROFORMA"] = "proforma";
    InvoiceType["CREDIT"] = "credit";
    InvoiceType["DEBIT"] = "debit";
})(InvoiceType = exports.InvoiceType || (exports.InvoiceType = {}));
var PaymentTerms;
(function (PaymentTerms) {
    PaymentTerms["DUE_ON_RECEIPT"] = "due_on_receipt";
    PaymentTerms["NET_7"] = "net_7";
    PaymentTerms["NET_15"] = "net_15";
    PaymentTerms["NET_30"] = "net_30";
    PaymentTerms["NET_60"] = "net_60";
})(PaymentTerms = exports.PaymentTerms || (exports.PaymentTerms = {}));
let Invoice = class Invoice extends BaseEntity_1.TenantAwareEntity {
};
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.Index)('IDX_INVOICES_NUMBER'),
    __metadata("design:type", String)
], Invoice.prototype, "invoiceNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: InvoiceType, default: InvoiceType.STANDARD }),
    __metadata("design:type", String)
], Invoice.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: InvoiceStatus, default: InvoiceStatus.DRAFT }),
    (0, typeorm_1.Index)('IDX_INVOICES_STATUS'),
    __metadata("design:type", String)
], Invoice.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.Index)('IDX_INVOICES_CUSTOMER'),
    __metadata("design:type", String)
], Invoice.prototype, "customerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Customer_1.Customer, customer => customer.invoices),
    (0, typeorm_1.JoinColumn)({ name: 'customerId' }),
    __metadata("design:type", Customer_1.Customer)
], Invoice.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    (0, typeorm_1.Index)('IDX_INVOICES_ISSUE_DATE'),
    __metadata("design:type", Date)
], Invoice.prototype, "issueDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    (0, typeorm_1.Index)('IDX_INVOICES_DUE_DATE'),
    __metadata("design:type", Date)
], Invoice.prototype, "dueDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Object)
], Invoice.prototype, "paidDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: PaymentTerms, default: PaymentTerms.NET_15 }),
    __metadata("design:type", String)
], Invoice.prototype, "paymentTerms", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Invoice.prototype, "shippingAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Invoice.prototype, "billingAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Invoice.prototype, "termsAndConditions", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Invoice.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Invoice.prototype, "subTotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Invoice.prototype, "taxTotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Invoice.prototype, "discountTotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Invoice.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Invoice.prototype, "amountPaid", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Invoice.prototype, "balanceDue", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => TaxDetail_1.TaxDetail, taxDetail => taxDetail.invoice, {
        cascade: true
    }),
    __metadata("design:type", Array)
], Invoice.prototype, "taxDetails", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], Invoice.prototype, "discountDetails", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Invoice.prototype, "isRecurring", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Invoice.prototype, "recurringSettings", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], Invoice.prototype, "sentAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], Invoice.prototype, "viewedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    (0, typeorm_1.Index)('IDX_INVOICES_DELETED_AT'),
    __metadata("design:type", Object)
], Invoice.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Tenant_1.Tenant, tenant => tenant.invoices),
    (0, typeorm_1.JoinColumn)({ name: 'tenantId' }),
    __metadata("design:type", Tenant_1.Tenant)
], Invoice.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => InvoiceItem_1.InvoiceItem, invoiceItem => invoiceItem.invoice, {
        cascade: true
    }),
    __metadata("design:type", Array)
], Invoice.prototype, "items", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => PaymentInvoice_1.PaymentInvoice, payment => payment.invoice),
    __metadata("design:type", Array)
], Invoice.prototype, "payments", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => GSTIN_1.GSTIN, (gstin) => gstin.invoices),
    (0, typeorm_1.JoinColumn)({ name: "gstinId" }),
    __metadata("design:type", GSTIN_1.GSTIN)
], Invoice.prototype, "gstin", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Subscription_1.Subscription, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'subscriptionId' }),
    __metadata("design:type", Subscription_1.Subscription)
], Invoice.prototype, "subscription", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Invoice.prototype, "metadata", void 0);
Invoice = __decorate([
    (0, typeorm_1.Entity)('invoices'),
    (0, typeorm_1.Index)('IDX_INVOICES_TENANT_DELETED', ['tenantId', 'deletedAt']),
    (0, typeorm_1.Index)('IDX_INVOICES_TENANT_STATUS_DELETED', ['tenantId', 'status', 'deletedAt']),
    (0, typeorm_1.Index)('IDX_INVOICES_TENANT_CUSTOMER_DELETED', ['tenantId', 'customerId', 'deletedAt']),
    (0, typeorm_1.Index)('IDX_INVOICES_TENANT_DUE_DATE_DELETED', ['tenantId', 'dueDate', 'deletedAt']),
    (0, typeorm_1.Index)('IDX_INVOICES_TENANT_CREATED_ID', ['tenantId', 'createdAt', 'id']),
    (0, typeorm_1.Index)('IDX_INVOICES_TENANT_NUMBER', ['tenantId', 'invoiceNumber'])
], Invoice);
exports.Invoice = Invoice;
//# sourceMappingURL=Invoice.js.map