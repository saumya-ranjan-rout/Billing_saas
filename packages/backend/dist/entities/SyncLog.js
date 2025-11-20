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
exports.SyncLog = void 0;
const typeorm_1 = require("typeorm");
const Tenant_1 = require("./Tenant");
const User_1 = require("./User");
let SyncLog = class SyncLog {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SyncLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: false }),
    __metadata("design:type", Object)
], SyncLog.prototype, "results", void 0);
__decorate([
    (0, typeorm_1.Index)('idx_sync_log_tenant'),
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], SyncLog.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.Index)('idx_sync_log_user'),
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], SyncLog.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Tenant_1.Tenant, tenant => tenant.syncLogs, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'tenantId' }),
    __metadata("design:type", Tenant_1.Tenant)
], SyncLog.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, user => user.syncLogs, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", User_1.User)
], SyncLog.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], SyncLog.prototype, "timestamp", void 0);
SyncLog = __decorate([
    (0, typeorm_1.Entity)('syncLog')
], SyncLog);
exports.SyncLog = SyncLog;
//# sourceMappingURL=SyncLog.js.map