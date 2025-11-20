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
exports.TenantSubscription = exports.SubscriptionStatus = void 0;
const typeorm_1 = require("typeorm");
const Tenant_1 = require("./Tenant");
const SubscriptionPlan_1 = require("./SubscriptionPlan");
const ProfessionalUser_1 = require("./ProfessionalUser");
var SubscriptionStatus;
(function (SubscriptionStatus) {
    SubscriptionStatus["ACTIVE"] = "active";
    SubscriptionStatus["PENDING"] = "pending";
    SubscriptionStatus["EXPIRED"] = "expired";
    SubscriptionStatus["CANCELLED"] = "cancelled";
    SubscriptionStatus["TRIAL"] = "trial";
})(SubscriptionStatus = exports.SubscriptionStatus || (exports.SubscriptionStatus = {}));
let TenantSubscription = class TenantSubscription {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TenantSubscription.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Tenant_1.Tenant, tenant => tenant.subscriptions),
    __metadata("design:type", Tenant_1.Tenant)
], TenantSubscription.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TenantSubscription.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => SubscriptionPlan_1.SubscriptionPlan),
    __metadata("design:type", SubscriptionPlan_1.SubscriptionPlan)
], TenantSubscription.prototype, "plan", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TenantSubscription.prototype, "planId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: SubscriptionStatus,
        default: SubscriptionStatus.PENDING
    }),
    __metadata("design:type", String)
], TenantSubscription.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], TenantSubscription.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], TenantSubscription.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], TenantSubscription.prototype, "trialEndDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], TenantSubscription.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], TenantSubscription.prototype, "isPaidByProfessional", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ProfessionalUser_1.ProfessionalUser, { nullable: true }),
    __metadata("design:type", ProfessionalUser_1.ProfessionalUser)
], TenantSubscription.prototype, "paidByProfessional", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], TenantSubscription.prototype, "paidByProfessionalId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], TenantSubscription.prototype, "stripeSubscriptionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], TenantSubscription.prototype, "stripeCustomerId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], TenantSubscription.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], TenantSubscription.prototype, "updatedAt", void 0);
TenantSubscription = __decorate([
    (0, typeorm_1.Entity)()
], TenantSubscription);
exports.TenantSubscription = TenantSubscription;
//# sourceMappingURL=TenantSubscription.js.map