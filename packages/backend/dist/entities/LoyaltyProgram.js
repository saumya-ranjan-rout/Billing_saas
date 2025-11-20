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
exports.LoyaltyProgram = exports.RewardType = exports.LoyaltyProgramStatus = void 0;
const typeorm_1 = require("typeorm");
const BaseEntity_1 = require("./BaseEntity");
const Tenant_1 = require("./Tenant");
var LoyaltyProgramStatus;
(function (LoyaltyProgramStatus) {
    LoyaltyProgramStatus["ACTIVE"] = "active";
    LoyaltyProgramStatus["INACTIVE"] = "inactive";
    LoyaltyProgramStatus["PAUSED"] = "paused";
})(LoyaltyProgramStatus = exports.LoyaltyProgramStatus || (exports.LoyaltyProgramStatus = {}));
var RewardType;
(function (RewardType) {
    RewardType["CASHBACK"] = "cashback";
    RewardType["POINTS"] = "points";
    RewardType["DISCOUNT"] = "discount";
})(RewardType = exports.RewardType || (exports.RewardType = {}));
let LoyaltyProgram = class LoyaltyProgram extends BaseEntity_1.TenantAwareEntity {
};
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], LoyaltyProgram.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], LoyaltyProgram.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: LoyaltyProgramStatus, default: LoyaltyProgramStatus.ACTIVE }),
    __metadata("design:type", String)
], LoyaltyProgram.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: RewardType, default: RewardType.CASHBACK }),
    __metadata("design:type", String)
], LoyaltyProgram.prototype, "rewardType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, default: 5.0 }),
    __metadata("design:type", Number)
], LoyaltyProgram.prototype, "cashbackPercentage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 10000.0 }),
    __metadata("design:type", Number)
], LoyaltyProgram.prototype, "minimumPurchaseAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], LoyaltyProgram.prototype, "maximumCashbackAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], LoyaltyProgram.prototype, "pointsPerUnit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], LoyaltyProgram.prototype, "pointValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: {} }),
    __metadata("design:type", Object)
], LoyaltyProgram.prototype, "eligibilityCriteria", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: {} }),
    __metadata("design:type", Object)
], LoyaltyProgram.prototype, "redemptionRules", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], LoyaltyProgram.prototype, "isDefault", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Tenant_1.Tenant, tenant => tenant.loyaltyPrograms),
    (0, typeorm_1.JoinColumn)({ name: 'tenantId' }),
    __metadata("design:type", Tenant_1.Tenant)
], LoyaltyProgram.prototype, "tenant", void 0);
LoyaltyProgram = __decorate([
    (0, typeorm_1.Entity)('loyalty_programs')
], LoyaltyProgram);
exports.LoyaltyProgram = LoyaltyProgram;
//# sourceMappingURL=LoyaltyProgram.js.map