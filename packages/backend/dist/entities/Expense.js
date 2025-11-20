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
exports.Expense = exports.PaymentMethod = exports.ExpenseCategory = void 0;
const typeorm_1 = require("typeorm");
const Tenant_1 = require("./Tenant");
var ExpenseCategory;
(function (ExpenseCategory) {
    ExpenseCategory["OFFICE_SUPPLIES"] = "office_supplies";
    ExpenseCategory["TRAVEL"] = "travel";
    ExpenseCategory["UTILITIES"] = "utilities";
    ExpenseCategory["SALARY"] = "salary";
    ExpenseCategory["MARKETING"] = "marketing";
    ExpenseCategory["SOFTWARE"] = "software";
    ExpenseCategory["HARDWARE"] = "hardware";
    ExpenseCategory["RENT"] = "rent";
    ExpenseCategory["MAINTENANCE"] = "maintenance";
    ExpenseCategory["OTHER"] = "other";
})(ExpenseCategory = exports.ExpenseCategory || (exports.ExpenseCategory = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CASH"] = "cash";
    PaymentMethod["BANK_TRANSFER"] = "bank_transfer";
    PaymentMethod["CHEQUE"] = "cheque";
    PaymentMethod["CARD"] = "card";
    PaymentMethod["ONLINE"] = "online";
})(PaymentMethod = exports.PaymentMethod || (exports.PaymentMethod = {}));
let Expense = class Expense {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Expense.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Expense.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], Expense.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ExpenseCategory,
        default: ExpenseCategory.OTHER
    }),
    __metadata("design:type", String)
], Expense.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PaymentMethod,
        default: PaymentMethod.CASH
    }),
    __metadata("design:type", String)
], Expense.prototype, "paymentMethod", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Expense.prototype, "expenseDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Expense.prototype, "referenceNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Expense.prototype, "vendor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Expense.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Tenant_1.Tenant, tenant => tenant.expenses),
    __metadata("design:type", Tenant_1.Tenant)
], Expense.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Expense.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Expense.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Expense.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], Expense.prototype, "deletedAt", void 0);
Expense = __decorate([
    (0, typeorm_1.Entity)('expenses')
], Expense);
exports.Expense = Expense;
//# sourceMappingURL=Expense.js.map