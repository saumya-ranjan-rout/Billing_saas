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
exports.SubscriptionPlan = exports.BillingCycle = exports.PlanType = void 0;
const typeorm_1 = require("typeorm");
const BaseEntity_1 = require("./BaseEntity");
const Subscription_1 = require("./Subscription");
var PlanType;
(function (PlanType) {
    PlanType["BASIC"] = "basic";
    PlanType["PROFESSIONAL"] = "professional";
    PlanType["ENTERPRISE"] = "enterprise";
})(PlanType = exports.PlanType || (exports.PlanType = {}));
var BillingCycle;
(function (BillingCycle) {
    BillingCycle["FIVE_DAYS"] = "5days";
    BillingCycle["WEEKLY"] = "weekly";
    BillingCycle["MONTHLY"] = "monthly";
    BillingCycle["YEARLY"] = "yearly";
})(BillingCycle = exports.BillingCycle || (exports.BillingCycle = {}));
let SubscriptionPlan = class SubscriptionPlan extends BaseEntity_1.TenantAwareEntity {
};
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], SubscriptionPlan.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], SubscriptionPlan.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: PlanType, default: PlanType.BASIC }),
    __metadata("design:type", String)
], SubscriptionPlan.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], SubscriptionPlan.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 3, default: 'INR' }),
    __metadata("design:type", String)
], SubscriptionPlan.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: BillingCycle, default: BillingCycle.YEARLY }),
    __metadata("design:type", String)
], SubscriptionPlan.prototype, "billingCycle", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 1 }),
    __metadata("design:type", Number)
], SubscriptionPlan.prototype, "maxTenants", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 1 }),
    __metadata("design:type", Number)
], SubscriptionPlan.prototype, "maxBusinesses", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 5 }),
    __metadata("design:type", Number)
], SubscriptionPlan.prototype, "maxUsers", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], SubscriptionPlan.prototype, "features", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], SubscriptionPlan.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], SubscriptionPlan.prototype, "trialDays", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 365 }),
    __metadata("design:type", Number)
], SubscriptionPlan.prototype, "validityDays", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Subscription_1.Subscription, subscription => subscription.plan),
    __metadata("design:type", Array)
], SubscriptionPlan.prototype, "subscriptions", void 0);
SubscriptionPlan = __decorate([
    (0, typeorm_1.Entity)('subscription_plans'),
    (0, typeorm_1.Index)(['tenantId', 'isActive'])
], SubscriptionPlan);
exports.SubscriptionPlan = SubscriptionPlan;
//# sourceMappingURL=SubscriptionPlan.js.map