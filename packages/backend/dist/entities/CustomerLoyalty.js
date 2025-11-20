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
exports.CustomerLoyalty = exports.LoyaltyTier = void 0;
const typeorm_1 = require("typeorm");
const BaseEntity_1 = require("./BaseEntity");
const Customer_1 = require("./Customer");
const LoyaltyProgram_1 = require("./LoyaltyProgram");
var LoyaltyTier;
(function (LoyaltyTier) {
    LoyaltyTier["BRONZE"] = "bronze";
    LoyaltyTier["SILVER"] = "silver";
    LoyaltyTier["GOLD"] = "gold";
    LoyaltyTier["PLATINUM"] = "platinum";
})(LoyaltyTier = exports.LoyaltyTier || (exports.LoyaltyTier = {}));
let CustomerLoyalty = class CustomerLoyalty extends BaseEntity_1.TenantAwareEntity {
};
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CustomerLoyalty.prototype, "customerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Customer_1.Customer, customer => customer.loyaltyData),
    (0, typeorm_1.JoinColumn)({ name: 'customerId' }),
    __metadata("design:type", Customer_1.Customer)
], CustomerLoyalty.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CustomerLoyalty.prototype, "programId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => LoyaltyProgram_1.LoyaltyProgram, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'programId' }),
    __metadata("design:type", LoyaltyProgram_1.LoyaltyProgram)
], CustomerLoyalty.prototype, "program", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], CustomerLoyalty.prototype, "totalPoints", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], CustomerLoyalty.prototype, "availablePoints", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], CustomerLoyalty.prototype, "totalCashbackEarned", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], CustomerLoyalty.prototype, "availableCashback", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], CustomerLoyalty.prototype, "totalAmountSpent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], CustomerLoyalty.prototype, "totalOrders", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: LoyaltyTier, default: LoyaltyTier.BRONZE }),
    __metadata("design:type", String)
], CustomerLoyalty.prototype, "currentTier", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], CustomerLoyalty.prototype, "tierExpiryDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: {} }),
    __metadata("design:type", Object)
], CustomerLoyalty.prototype, "tierBenefits", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], CustomerLoyalty.prototype, "lastActivityDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: {} }),
    __metadata("design:type", Object)
], CustomerLoyalty.prototype, "statistics", void 0);
CustomerLoyalty = __decorate([
    (0, typeorm_1.Entity)('customer_loyalty')
], CustomerLoyalty);
exports.CustomerLoyalty = CustomerLoyalty;
//# sourceMappingURL=CustomerLoyalty.js.map