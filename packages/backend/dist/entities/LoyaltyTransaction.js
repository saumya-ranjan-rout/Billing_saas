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
exports.LoyaltyTransaction = exports.TransactionStatus = exports.TransactionType = void 0;
const typeorm_1 = require("typeorm");
const BaseEntity_1 = require("./BaseEntity");
const Customer_1 = require("./Customer");
const Invoice_1 = require("./Invoice");
const LoyaltyProgram_1 = require("./LoyaltyProgram");
var TransactionType;
(function (TransactionType) {
    TransactionType["EARN"] = "earn";
    TransactionType["REDEEM"] = "redeem";
    TransactionType["EXPIRY"] = "expiry";
    TransactionType["ADJUSTMENT"] = "adjustment";
})(TransactionType = exports.TransactionType || (exports.TransactionType = {}));
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["PENDING"] = "pending";
    TransactionStatus["COMPLETED"] = "completed";
    TransactionStatus["CANCELLED"] = "cancelled";
    TransactionStatus["EXPIRED"] = "expired";
})(TransactionStatus = exports.TransactionStatus || (exports.TransactionStatus = {}));
let LoyaltyTransaction = class LoyaltyTransaction extends BaseEntity_1.TenantAwareEntity {
};
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], LoyaltyTransaction.prototype, "customerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Customer_1.Customer, customer => customer.loyaltyTransactions),
    (0, typeorm_1.JoinColumn)({ name: 'customerId' }),
    __metadata("design:type", Customer_1.Customer)
], LoyaltyTransaction.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], LoyaltyTransaction.prototype, "invoiceId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Invoice_1.Invoice, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'invoiceId' }),
    __metadata("design:type", Invoice_1.Invoice)
], LoyaltyTransaction.prototype, "invoice", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], LoyaltyTransaction.prototype, "programId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => LoyaltyProgram_1.LoyaltyProgram, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'programId' }),
    __metadata("design:type", LoyaltyProgram_1.LoyaltyProgram)
], LoyaltyTransaction.prototype, "program", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: TransactionType }),
    __metadata("design:type", String)
], LoyaltyTransaction.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: TransactionStatus, default: TransactionStatus.PENDING }),
    __metadata("design:type", String)
], LoyaltyTransaction.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], LoyaltyTransaction.prototype, "points", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], LoyaltyTransaction.prototype, "cashbackAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], LoyaltyTransaction.prototype, "orderAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], LoyaltyTransaction.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], LoyaltyTransaction.prototype, "expiryDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], LoyaltyTransaction.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], LoyaltyTransaction.prototype, "effectivePercentage", void 0);
LoyaltyTransaction = __decorate([
    (0, typeorm_1.Entity)('loyalty_transactions')
], LoyaltyTransaction);
exports.LoyaltyTransaction = LoyaltyTransaction;
//# sourceMappingURL=LoyaltyTransaction.js.map