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
exports.ProfessionalUser = exports.ProfessionalType = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const Tenant_1 = require("./Tenant");
const BaseEntity_1 = require("./BaseEntity");
var ProfessionalType;
(function (ProfessionalType) {
    ProfessionalType["CA"] = "ca";
    ProfessionalType["ACCOUNTANT"] = "accountant";
    ProfessionalType["CONSULTANT"] = "consultant";
    ProfessionalType["OTHER"] = "other";
})(ProfessionalType = exports.ProfessionalType || (exports.ProfessionalType = {}));
let ProfessionalUser = class ProfessionalUser extends BaseEntity_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], ProfessionalUser.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ProfessionalUser.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.professionals, { onDelete: 'CASCADE' }),
    __metadata("design:type", User_1.User)
], ProfessionalUser.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ProfessionalType }),
    __metadata("design:type", String)
], ProfessionalUser.prototype, "professionalType", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ProfessionalUser.prototype, "firmName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ProfessionalUser.prototype, "professionalLicenseNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ProfessionalUser.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ProfessionalUser.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], ProfessionalUser.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Tenant_1.Tenant, (tenant) => tenant.professionals),
    (0, typeorm_1.JoinTable)({
        name: 'professional_tenants',
        joinColumn: { name: 'professionalId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'tenantId', referencedColumnName: 'id' },
    }),
    __metadata("design:type", Array)
], ProfessionalUser.prototype, "managedTenants", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], ProfessionalUser.prototype, "permissions", void 0);
ProfessionalUser = __decorate([
    (0, typeorm_1.Entity)('professional_user')
], ProfessionalUser);
exports.ProfessionalUser = ProfessionalUser;
//# sourceMappingURL=ProfessionalUser.js.map