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
exports.Plan = exports.BillingInterval = void 0;
const typeorm_1 = require("typeorm");
const BaseEntity_1 = require("./BaseEntity");
const Subscription_1 = require("./Subscription");
const PlanFeature_1 = require("./PlanFeature");
var BillingInterval;
(function (BillingInterval) {
    BillingInterval["MONTH"] = "month";
    BillingInterval["QUARTER"] = "quarter";
    BillingInterval["YEAR"] = "year";
})(BillingInterval = exports.BillingInterval || (exports.BillingInterval = {}));
let Plan = class Plan extends BaseEntity_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.Column)({ name: 'name', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Plan.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Plan.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'price', type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Plan.prototype, "price_amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 3, default: 'USD' }),
    __metadata("design:type", String)
], Plan.prototype, "price_currency", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: BillingInterval,
        default: BillingInterval.MONTH,
    }),
    __metadata("design:type", String)
], Plan.prototype, "billing_interval", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Plan.prototype, "trial_period_days", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Plan.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Subscription_1.Subscription, (subscription) => subscription.plan),
    __metadata("design:type", Array)
], Plan.prototype, "subscriptions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => PlanFeature_1.PlanFeature, (feature) => feature.plan),
    __metadata("design:type", Array)
], Plan.prototype, "features", void 0);
Plan = __decorate([
    (0, typeorm_1.Entity)('plans')
], Plan);
exports.Plan = Plan;
//# sourceMappingURL=Plan.js.map