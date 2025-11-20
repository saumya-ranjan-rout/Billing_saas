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
exports.Subscription = exports.BillingCycle = exports.SubscriptionStatus = void 0;
const typeorm_1 = require("typeorm");
const BaseEntity_1 = require("./BaseEntity");
const SubscriptionPlan_1 = require("./SubscriptionPlan");
const User_1 = require("./User");
const Payment_1 = require("./Payment");
const Tenant_1 = require("./Tenant");
var SubscriptionStatus;
(function (SubscriptionStatus) {
    SubscriptionStatus["ACTIVE"] = "active";
    SubscriptionStatus["INACTIVE"] = "inactive";
    SubscriptionStatus["PENDING"] = "pending";
    SubscriptionStatus["EXPIRED"] = "expired";
    SubscriptionStatus["CANCELLED"] = "cancelled";
    SubscriptionStatus["TRIAL"] = "trial";
})(SubscriptionStatus = exports.SubscriptionStatus || (exports.SubscriptionStatus = {}));
var BillingCycle;
(function (BillingCycle) {
    BillingCycle["MONTHLY"] = "monthly";
    BillingCycle["QUARTERLY"] = "quarterly";
    BillingCycle["YEARLY"] = "yearly";
})(BillingCycle = exports.BillingCycle || (exports.BillingCycle = {}));
let Subscription = class Subscription extends BaseEntity_1.TenantAwareEntity {
};
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Subscription.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", User_1.User)
], Subscription.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Subscription.prototype, "planId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => SubscriptionPlan_1.SubscriptionPlan),
    (0, typeorm_1.JoinColumn)({ name: 'planId' }),
    __metadata("design:type", SubscriptionPlan_1.SubscriptionPlan)
], Subscription.prototype, "plan", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: SubscriptionStatus, default: SubscriptionStatus.PENDING }),
    __metadata("design:type", String)
], Subscription.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Subscription.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Subscription.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Subscription.prototype, "cancelledAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Subscription.prototype, "autoRenew", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Subscription.prototype, "stripeSubscriptionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Subscription.prototype, "razorpaySubscriptionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Subscription.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Payment_1.Payment, payment => payment.subscription),
    __metadata("design:type", Array)
], Subscription.prototype, "payments", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Tenant_1.Tenant, (tenant) => tenant.subscriptions, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'tenantId' }),
    __metadata("design:type", Tenant_1.Tenant)
], Subscription.prototype, "tenant", void 0);
Subscription = __decorate([
    (0, typeorm_1.Entity)('subscriptions'),
    (0, typeorm_1.Index)(['tenantId', 'status']),
    (0, typeorm_1.Index)(['userId', 'status'])
], Subscription);
exports.Subscription = Subscription;
//# sourceMappingURL=Subscription.js.map