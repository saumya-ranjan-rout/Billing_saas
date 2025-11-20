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
exports.SubscriptionPlan = exports.BillingPeriod = exports.PlanType = void 0;
const typeorm_1 = require("typeorm");
const BaseEntity_1 = require("./BaseEntity");
var PlanType;
(function (PlanType) {
    PlanType["TENANT"] = "tenant";
    PlanType["PROFESSIONAL"] = "professional";
})(PlanType = exports.PlanType || (exports.PlanType = {}));
var BillingPeriod;
(function (BillingPeriod) {
    BillingPeriod["MONTHLY"] = "monthly";
    BillingPeriod["YEARLY"] = "yearly";
    BillingPeriod["LIFETIME"] = "lifetime";
})(BillingPeriod = exports.BillingPeriod || (exports.BillingPeriod = {}));
let SubscriptionPlan = class SubscriptionPlan extends BaseEntity_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SubscriptionPlan.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: PlanType }),
    __metadata("design:type", String)
], SubscriptionPlan.prototype, "planType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: BillingPeriod, default: BillingPeriod.YEARLY }),
    __metadata("design:type", String)
], SubscriptionPlan.prototype, "billingPeriod", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], SubscriptionPlan.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SubscriptionPlan.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    __metadata("design:type", Array)
], SubscriptionPlan.prototype, "features", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: {} }),
    __metadata("design:type", Object)
], SubscriptionPlan.prototype, "limits", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], SubscriptionPlan.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], SubscriptionPlan.prototype, "isDefault", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], SubscriptionPlan.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], SubscriptionPlan.prototype, "trialDays", void 0);
SubscriptionPlan = __decorate([
    (0, typeorm_1.Entity)('subscription_plans')
], SubscriptionPlan);
exports.SubscriptionPlan = SubscriptionPlan;
//# sourceMappingURL=SubscriptionPlan1.js.map