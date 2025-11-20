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
exports.SubscriptionChange = exports.ChangeStatus = exports.ChangeType = void 0;
const typeorm_1 = require("typeorm");
const BaseEntity_1 = require("./BaseEntity");
const Plan_1 = require("./Plan");
const User_1 = require("./User");
var ChangeType;
(function (ChangeType) {
    ChangeType["UPGRADE"] = "upgrade";
    ChangeType["DOWNGRADE"] = "downgrade";
    ChangeType["SWITCH"] = "switch";
})(ChangeType = exports.ChangeType || (exports.ChangeType = {}));
var ChangeStatus;
(function (ChangeStatus) {
    ChangeStatus["PENDING"] = "pending";
    ChangeStatus["APPROVED"] = "approved";
    ChangeStatus["REJECTED"] = "rejected";
    ChangeStatus["COMPLETED"] = "completed";
})(ChangeStatus = exports.ChangeStatus || (exports.ChangeStatus = {}));
let SubscriptionChange = class SubscriptionChange extends BaseEntity_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.Column)({ name: 'subscription_id', type: 'uuid' }),
    __metadata("design:type", String)
], SubscriptionChange.prototype, "subscriptionId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Plan_1.Plan, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'requested_plan_id' }),
    __metadata("design:type", Plan_1.Plan)
], SubscriptionChange.prototype, "plan", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'requested_plan_id', type: 'uuid' }),
    __metadata("design:type", String)
], SubscriptionChange.prototype, "requested_plan_id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ChangeType,
        default: ChangeType.SWITCH,
    }),
    __metadata("design:type", String)
], SubscriptionChange.prototype, "change_type", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ChangeStatus,
        default: ChangeStatus.PENDING,
    }),
    __metadata("design:type", String)
], SubscriptionChange.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], SubscriptionChange.prototype, "scheduled_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], SubscriptionChange.prototype, "effective_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 19, scale: 4, nullable: true }),
    __metadata("design:type", Object)
], SubscriptionChange.prototype, "prorated_amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], SubscriptionChange.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'requested_by' }),
    __metadata("design:type", User_1.User)
], SubscriptionChange.prototype, "requested_by", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'requested_by', type: 'uuid' }),
    __metadata("design:type", String)
], SubscriptionChange.prototype, "requested_by_user_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, { nullable: true }),
    __metadata("design:type", User_1.User)
], SubscriptionChange.prototype, "reviewed_by", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SubscriptionChange.prototype, "reviewed_by_user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], SubscriptionChange.prototype, "reviewed_at", void 0);
SubscriptionChange = __decorate([
    (0, typeorm_1.Entity)('subscription_changes')
], SubscriptionChange);
exports.SubscriptionChange = SubscriptionChange;
//# sourceMappingURL=SubscriptionChange.js.map