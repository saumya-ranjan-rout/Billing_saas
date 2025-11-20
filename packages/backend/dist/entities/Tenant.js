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
exports.Tenant = exports.TenantStatus = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const Invoice_1 = require("./Invoice");
const Subscription_1 = require("./Subscription");
const GSTIN_1 = require("./GSTIN");
const SyncLog_1 = require("./SyncLog");
const Client_1 = require("./Client");
const Product_1 = require("./Product");
const HSN_1 = require("./HSN");
const BaseEntity_1 = require("./BaseEntity");
const TaxRate_1 = require("./TaxRate");
const ProfessionalUser_1 = require("./ProfessionalUser");
const PurchaseOrder_1 = require("./PurchaseOrder");
const Vendor_1 = require("./Vendor");
const Category_1 = require("./Category");
const PaymentInvoice_1 = require("./PaymentInvoice");
const Report_1 = require("./Report");
const Expense_1 = require("./Expense");
const LoyaltyProgram_1 = require("./LoyaltyProgram");
var TenantStatus;
(function (TenantStatus) {
    TenantStatus["ACTIVE"] = "active";
    TenantStatus["SUSPENDED"] = "suspended";
    TenantStatus["TRIAL"] = "trial";
    TenantStatus["TRIAL_EXPIRED"] = "trial_expired";
})(TenantStatus = exports.TenantStatus || (exports.TenantStatus = {}));
let Tenant = class Tenant extends BaseEntity_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: false }),
    __metadata("design:type", String)
], Tenant.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Tenant.prototype, "businessName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Tenant.prototype, "subdomain", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Tenant.prototype, "slug", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: TenantStatus, default: TenantStatus.TRIAL }),
    __metadata("design:type", String)
], Tenant.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Tenant.prototype, "trialEndsAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Tenant.prototype, "stripeCustomerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Tenant.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Tenant.prototype, "accountType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Tenant.prototype, "professionType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Tenant.prototype, "licenseNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10, nullable: true }),
    __metadata("design:type", String)
], Tenant.prototype, "pan", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 15, nullable: true }),
    __metadata("design:type", String)
], Tenant.prototype, "gst", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => User_1.User, user => user.tenant),
    __metadata("design:type", Array)
], Tenant.prototype, "users", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Invoice_1.Invoice, invoice => invoice.tenant),
    __metadata("design:type", Array)
], Tenant.prototype, "invoices", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Subscription_1.Subscription, subscription => subscription.tenant),
    __metadata("design:type", Array)
], Tenant.prototype, "subscriptions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => GSTIN_1.GSTIN, gstin => gstin.tenant),
    __metadata("design:type", Array)
], Tenant.prototype, "gstins", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Client_1.Client, client => client.tenant),
    __metadata("design:type", Array)
], Tenant.prototype, "clients", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => SyncLog_1.SyncLog, syncLog => syncLog.tenant),
    __metadata("design:type", Array)
], Tenant.prototype, "syncLogs", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Category_1.Category, category => category.tenant),
    __metadata("design:type", Array)
], Tenant.prototype, "categories", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Product_1.Product, product => product.tenant),
    __metadata("design:type", Array)
], Tenant.prototype, "products", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => HSN_1.HSN, hsn => hsn.tenant),
    __metadata("design:type", Array)
], Tenant.prototype, "hsnCodes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => TaxRate_1.TaxRate, taxRate => taxRate.tenant),
    __metadata("design:type", Array)
], Tenant.prototype, "taxRates", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => ProfessionalUser_1.ProfessionalUser, professional => professional.managedTenants),
    __metadata("design:type", Array)
], Tenant.prototype, "professionals", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => PurchaseOrder_1.PurchaseOrder, po => po.tenant),
    __metadata("design:type", Array)
], Tenant.prototype, "purchaseOrders", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Vendor_1.Vendor, vendor => vendor.tenant),
    __metadata("design:type", Array)
], Tenant.prototype, "vendors", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => PaymentInvoice_1.PaymentInvoice, payment => payment.tenant),
    __metadata("design:type", Array)
], Tenant.prototype, "payments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Report_1.Report, report => report.tenant),
    __metadata("design:type", Array)
], Tenant.prototype, "reports", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Expense_1.Expense, expense => expense.tenant),
    __metadata("design:type", Array)
], Tenant.prototype, "expenses", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => LoyaltyProgram_1.LoyaltyProgram, loyaltyProgram => loyaltyProgram.tenant),
    __metadata("design:type", Array)
], Tenant.prototype, "loyaltyPrograms", void 0);
Tenant = __decorate([
    (0, typeorm_1.Entity)('tenant')
], Tenant);
exports.Tenant = Tenant;
//# sourceMappingURL=Tenant.js.map