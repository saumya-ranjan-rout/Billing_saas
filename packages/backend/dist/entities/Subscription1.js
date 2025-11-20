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
exports.Subscription = exports.BillingCycle = exports.PaymentGateway = exports.SubscriptionStatus = void 0;
const typeorm_1 = require("typeorm");
const BaseEntity_1 = require("./BaseEntity");
const Tenant_1 = require("./Tenant");
const ProfessionalUser_1 = require("./ProfessionalUser");
const SubscriptionPlan_1 = require("./SubscriptionPlan");
const SubscriptionChange_1 = require("./SubscriptionChange");
const Payment_1 = require("./Payment");
var SubscriptionStatus;
(function (SubscriptionStatus) {
    SubscriptionStatus["ACTIVE"] = "active";
    SubscriptionStatus["PENDING"] = "pending";
    SubscriptionStatus["CANCELLED"] = "cancelled";
    SubscriptionStatus["EXPIRED"] = "expired";
    SubscriptionStatus["PAUSED"] = "paused";
    SubscriptionStatus["TRIALING"] = "trialing";
})(SubscriptionStatus = exports.SubscriptionStatus || (exports.SubscriptionStatus = {}));
var PaymentGateway;
(function (PaymentGateway) {
    PaymentGateway["RAZORPAY"] = "razorpay";
    PaymentGateway["STRIPE"] = "stripe";
    PaymentGateway["PAYPAL"] = "paypal";
    PaymentGateway["MANUAL"] = "manual";
})(PaymentGateway = exports.PaymentGateway || (exports.PaymentGateway = {}));
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
], Subscription.prototype, "planId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => SubscriptionPlan_1.SubscriptionPlan),
    (0, typeorm_1.JoinColumn)({ name: 'planId' }),
    __metadata("design:type", SubscriptionPlan_1.SubscriptionPlan)
], Subscription.prototype, "plan", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Subscription.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Tenant_1.Tenant, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'tenantId' }),
    __metadata("design:type", Tenant_1.Tenant)
], Subscription.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Subscription.prototype, "professionalId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ProfessionalUser_1.ProfessionalUser, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'professionalId' }),
    __metadata("design:type", ProfessionalUser_1.ProfessionalUser)
], Subscription.prototype, "professional", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: SubscriptionStatus, default: SubscriptionStatus.PENDING }),
    __metadata("design:type", String)
], Subscription.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Subscription.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Subscription.prototype, "currency", void 0);
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
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Subscription.prototype, "trialEndsAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: PaymentGateway, default: PaymentGateway.RAZORPAY }),
    __metadata("design:type", String)
], Subscription.prototype, "paymentGateway", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Subscription.prototype, "paymentGatewayId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Subscription.prototype, "paymentGatewaySubscriptionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Subscription.prototype, "paymentDetails", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: {} }),
    __metadata("design:type", Object)
], Subscription.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Subscription.prototype, "autoRenew", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Subscription.prototype, "nextBillingDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Subscription.prototype, "cancelAtPeriodEnd", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => SubscriptionChange_1.SubscriptionChange, (change) => change.subscription),
    __metadata("design:type", Array)
], Subscription.prototype, "changes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Payment_1.Payment, payment => payment.subscription),
    __metadata("design:type", Array)
], Subscription.prototype, "payments", void 0);
Subscription = __decorate([
    (0, typeorm_1.Entity)('subscriptions')
], Subscription);
exports.Subscription = Subscription;
//# sourceMappingURL=Subscription1.js.map