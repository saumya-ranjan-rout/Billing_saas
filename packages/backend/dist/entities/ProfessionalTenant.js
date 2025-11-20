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
exports.ProfessionalTenant = void 0;
const typeorm_1 = require("typeorm");
const ProfessionalUser_1 = require("./ProfessionalUser");
const Tenant_1 = require("./Tenant");
let ProfessionalTenant = class ProfessionalTenant {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ProfessionalTenant.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ProfessionalUser_1.ProfessionalUser, professional => professional.managedTenants),
    __metadata("design:type", ProfessionalUser_1.ProfessionalUser)
], ProfessionalTenant.prototype, "professional", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ProfessionalTenant.prototype, "professionalId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Tenant_1.Tenant, tenant => tenant.professionals),
    __metadata("design:type", Tenant_1.Tenant)
], ProfessionalTenant.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ProfessionalTenant.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], ProfessionalTenant.prototype, "specificPermissions", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], ProfessionalTenant.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ProfessionalTenant.prototype, "assignedAt", void 0);
ProfessionalTenant = __decorate([
    (0, typeorm_1.Entity)('professional_tenants')
], ProfessionalTenant);
exports.ProfessionalTenant = ProfessionalTenant;
//# sourceMappingURL=ProfessionalTenant.js.map