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
exports.PlanFeature = void 0;
const typeorm_1 = require("typeorm");
const BaseEntity_1 = require("./BaseEntity");
const Plan_1 = require("./Plan");
let PlanFeature = class PlanFeature extends BaseEntity_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.ManyToOne)(() => Plan_1.Plan, (plan) => plan.features, { onDelete: 'CASCADE' }),
    __metadata("design:type", Plan_1.Plan)
], PlanFeature.prototype, "plan", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'plan_id', type: 'uuid' }),
    __metadata("design:type", String)
], PlanFeature.prototype, "planId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'code', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], PlanFeature.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'name', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], PlanFeature.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], PlanFeature.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], PlanFeature.prototype, "value", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], PlanFeature.prototype, "sort_order", void 0);
PlanFeature = __decorate([
    (0, typeorm_1.Entity)('plan_features')
], PlanFeature);
exports.PlanFeature = PlanFeature;
//# sourceMappingURL=PlanFeature.js.map