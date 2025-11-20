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
exports.AuditLog = exports.AuditResource = exports.AuditAction = void 0;
const typeorm_1 = require("typeorm");
const SuperAdmin_1 = require("./SuperAdmin");
var AuditAction;
(function (AuditAction) {
    AuditAction["CREATE"] = "create";
    AuditAction["UPDATE"] = "update";
    AuditAction["DELETE"] = "delete";
    AuditAction["LOGIN"] = "login";
    AuditAction["LOGOUT"] = "logout";
    AuditAction["EXPORT"] = "export";
})(AuditAction = exports.AuditAction || (exports.AuditAction = {}));
var AuditResource;
(function (AuditResource) {
    AuditResource["USER"] = "user";
    AuditResource["TENANT"] = "tenant";
    AuditResource["PROFESSIONAL"] = "professional";
    AuditResource["SUBSCRIPTION"] = "subscription";
    AuditResource["SYSTEM"] = "system";
})(AuditResource = exports.AuditResource || (exports.AuditResource = {}));
let AuditLog = class AuditLog {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AuditLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => SuperAdmin_1.SuperAdmin, { nullable: true }),
    __metadata("design:type", SuperAdmin_1.SuperAdmin)
], AuditLog.prototype, "performedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AuditLog.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AuditLog.prototype, "performedById", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AuditAction
    }),
    __metadata("design:type", String)
], AuditLog.prototype, "action", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AuditResource
    }),
    __metadata("design:type", String)
], AuditLog.prototype, "resource", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AuditLog.prototype, "resourceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], AuditLog.prototype, "details", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AuditLog.prototype, "ipAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AuditLog.prototype, "userAgent", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AuditLog.prototype, "timestamp", void 0);
AuditLog = __decorate([
    (0, typeorm_1.Entity)()
], AuditLog);
exports.AuditLog = AuditLog;
//# sourceMappingURL=AuditLog.js.map