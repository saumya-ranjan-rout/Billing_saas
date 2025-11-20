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
exports.SyncLog = exports.Subscription = exports.Notification = exports.User = exports.InvoiceItem = exports.Invoice = exports.Product = exports.HsnCode = exports.GSTIN = exports.Client = void 0;
const typeorm_1 = require("typeorm");
const Tenant_1 = require("./Tenant");
let Client = class Client {
};
__decorate([
    (0, typeorm_1.PrimaryColumn)("uuid"),
    __metadata("design:type", String)
], Client.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], Client.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], Client.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], Client.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], Client.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Client.prototype, "taxId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Tenant_1.Tenant, (tenant) => tenant.clients, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "tenantId" }),
    __metadata("design:type", Tenant_1.Tenant)
], Client.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Date)
], Client.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Date)
], Client.prototype, "updatedAt", void 0);
Client = __decorate([
    (0, typeorm_1.Entity)("client")
], Client);
exports.Client = Client;
let GSTIN = class GSTIN {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], GSTIN.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], GSTIN.prototype, "gstin", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], GSTIN.prototype, "legalname", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], GSTIN.prototype, "tradename", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb" }),
    __metadata("design:type", Object)
], GSTIN.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 10 }),
    __metadata("design:type", String)
], GSTIN.prototype, "statecode", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], GSTIN.prototype, "isactive", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], GSTIN.prototype, "isprimary", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], GSTIN.prototype, "authstatus", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Tenant_1.Tenant, (tenant) => tenant.gstins, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "tenantId" }),
    __metadata("design:type", Tenant_1.Tenant)
], GSTIN.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], GSTIN.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], GSTIN.prototype, "updatedAt", void 0);
GSTIN = __decorate([
    (0, typeorm_1.Entity)("gstins")
], GSTIN);
exports.GSTIN = GSTIN;
let HsnCode = class HsnCode {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], HsnCode.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], HsnCode.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], HsnCode.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { precision: 5, scale: 2 }),
    __metadata("design:type", Number)
], HsnCode.prototype, "gstrate", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], HsnCode.prototype, "cessrate", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], HsnCode.prototype, "isactive", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Tenant_1.Tenant, (tenant) => tenant.hsnCodes),
    (0, typeorm_1.JoinColumn)({ name: "tenantid" }),
    __metadata("design:type", Tenant_1.Tenant)
], HsnCode.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], HsnCode.prototype, "createdat", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], HsnCode.prototype, "updatedat", void 0);
HsnCode = __decorate([
    (0, typeorm_1.Entity)("hsn_codes")
], HsnCode);
exports.HsnCode = HsnCode;
let Product = class Product {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Product.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], Product.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", default: "service" }),
    __metadata("design:type", String)
], Product.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], Product.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 10 }),
    __metadata("design:type", String)
], Product.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Product.prototype, "isactive", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "sku", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], Product.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Tenant_1.Tenant, (tenant) => tenant.products),
    (0, typeorm_1.JoinColumn)({ name: "tenantid" }),
    __metadata("design:type", Tenant_1.Tenant)
], Product.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => HsnCode, (hsn) => hsn.id),
    (0, typeorm_1.JoinColumn)({ name: "hsnid" }),
    __metadata("design:type", HsnCode)
], Product.prototype, "hsn", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Product.prototype, "createdat", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Product.prototype, "updatedat", void 0);
Product = __decorate([
    (0, typeorm_1.Entity)("products")
], Product);
exports.Product = Product;
let Invoice = class Invoice {
};
__decorate([
    (0, typeorm_1.PrimaryColumn)("uuid"),
    __metadata("design:type", String)
], Invoice.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], Invoice.prototype, "invoiceNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], Invoice.prototype, "clientName", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Invoice.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date" }),
    __metadata("design:type", Date)
], Invoice.prototype, "dueDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, default: "draft" }),
    __metadata("design:type", String)
], Invoice.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], Invoice.prototype, "items", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Tenant_1.Tenant, (tenant) => tenant.invoices, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "tenantId" }),
    __metadata("design:type", Tenant_1.Tenant)
], Invoice.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => InvoiceItem, (item) => item.invoice),
    __metadata("design:type", Array)
], Invoice.prototype, "invoiceItems", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Invoice.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Invoice.prototype, "updatedAt", void 0);
Invoice = __decorate([
    (0, typeorm_1.Entity)("invoice")
], Invoice);
exports.Invoice = Invoice;
let InvoiceItem = class InvoiceItem {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], InvoiceItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], InvoiceItem.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], InvoiceItem.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], InvoiceItem.prototype, "unit", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], InvoiceItem.prototype, "unitprice", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], InvoiceItem.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { precision: 5, scale: 2 }),
    __metadata("design:type", Number)
], InvoiceItem.prototype, "taxrate", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], InvoiceItem.prototype, "taxamount", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], InvoiceItem.prototype, "cessrate", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], InvoiceItem.prototype, "cessamount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], InvoiceItem.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Invoice, (invoice) => invoice.invoiceItems, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "invoiceid" }),
    __metadata("design:type", Invoice)
], InvoiceItem.prototype, "invoice", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Product, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "productid" }),
    __metadata("design:type", Product)
], InvoiceItem.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => HsnCode, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "hsnid" }),
    __metadata("design:type", HsnCode)
], InvoiceItem.prototype, "hsn", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Tenant_1.Tenant, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "tenantid" }),
    __metadata("design:type", Tenant_1.Tenant)
], InvoiceItem.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], InvoiceItem.prototype, "createdat", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], InvoiceItem.prototype, "updatedat", void 0);
InvoiceItem = __decorate([
    (0, typeorm_1.Entity)("invoice_items")
], InvoiceItem);
exports.InvoiceItem = InvoiceItem;
let User = class User {
};
__decorate([
    (0, typeorm_1.PrimaryColumn)("uuid"),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], User.prototype, "pushToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, default: "user" }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "biometricEnabled", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Tenant_1.Tenant, (tenant) => tenant.users, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "tenantId" }),
    __metadata("design:type", Tenant_1.Tenant)
], User.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Notification, (n) => n.user),
    __metadata("design:type", Array)
], User.prototype, "notifications", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
User = __decorate([
    (0, typeorm_1.Entity)("user")
], User);
exports.User = User;
let Notification = class Notification {
};
__decorate([
    (0, typeorm_1.PrimaryColumn)("uuid"),
    __metadata("design:type", String)
], Notification.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], Notification.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], Notification.prototype, "body", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], Notification.prototype, "data", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Notification.prototype, "isRead", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Notification.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, default: "normal" }),
    __metadata("design:type", String)
], Notification.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User, (user) => user.notifications, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "userId" }),
    __metadata("design:type", User)
], Notification.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Notification.prototype, "createdAt", void 0);
Notification = __decorate([
    (0, typeorm_1.Entity)("notification")
], Notification);
exports.Notification = Notification;
let Subscription = class Subscription {
};
__decorate([
    (0, typeorm_1.PrimaryColumn)("uuid"),
    __metadata("design:type", String)
], Subscription.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Tenant_1.Tenant, (tenant) => tenant.subscriptions, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "tenantId" }),
    __metadata("design:type", Tenant_1.Tenant)
], Subscription.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Subscription.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], Subscription.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: "trialing" }),
    __metadata("design:type", String)
], Subscription.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: "monthly" }),
    __metadata("design:type", String)
], Subscription.prototype, "billingCycle", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Subscription.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb", default: [] }),
    __metadata("design:type", Object)
], Subscription.prototype, "features", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 1 }),
    __metadata("design:type", Number)
], Subscription.prototype, "userLimit", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Subscription.prototype, "invoiceLimit", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Subscription.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamptz", nullable: true }),
    __metadata("design:type", Date)
], Subscription.prototype, "currentPeriodStart", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamptz", nullable: true }),
    __metadata("design:type", Date)
], Subscription.prototype, "currentPeriodEnd", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamptz", nullable: true }),
    __metadata("design:type", Date)
], Subscription.prototype, "cancelAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Subscription.prototype, "cancelAtPeriodEnd", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Subscription.prototype, "stripeSubscriptionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Subscription.prototype, "stripeCustomerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Subscription.prototype, "stripePriceId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Subscription.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Subscription.prototype, "updatedAt", void 0);
Subscription = __decorate([
    (0, typeorm_1.Entity)("subscriptions")
], Subscription);
exports.Subscription = Subscription;
let SyncLog = class SyncLog {
};
__decorate([
    (0, typeorm_1.PrimaryColumn)("uuid"),
    __metadata("design:type", String)
], SyncLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb" }),
    __metadata("design:type", Object)
], SyncLog.prototype, "results", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Tenant_1.Tenant, (tenant) => tenant.syncLogs, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "tenantId" }),
    __metadata("design:type", Tenant_1.Tenant)
], SyncLog.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User, (user) => user.id, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "userId" }),
    __metadata("design:type", User)
], SyncLog.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], SyncLog.prototype, "timestamp", void 0);
SyncLog = __decorate([
    (0, typeorm_1.Entity)("syncLog")
], SyncLog);
exports.SyncLog = SyncLog;
//# sourceMappingURL=allentity.js.map