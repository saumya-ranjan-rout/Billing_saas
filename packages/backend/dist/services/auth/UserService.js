"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const User_1 = require("../../entities/User");
const database_1 = require("../../config/database");
const BaseService_1 = require("../BaseService");
const errors_1 = require("../../utils/errors");
class UserService extends BaseService_1.TenantAwareService {
    constructor() {
        super(database_1.AppDataSource.getRepository(User_1.User));
    }
    async createUser(data) {
        const where = { email: data.email };
        if (data.tenantId) {
            where.tenantId = data.tenantId;
        }
        const existingUser = await this.repository.findOne({ where
        });
        if (existingUser) {
            throw new errors_1.BadRequestError('User already exists in this tenant');
        }
        return this.create(data);
    }
    async updateUserRole(userId, tenantId, role) {
        return this.update(userId, { role });
    }
    async deactivateUser(userId, tenantId) {
        return this.update(userId, { status: User_1.UserStatus.SUSPENDED });
    }
    async activateUser(userId, tenantId) {
        return this.update(userId, { status: User_1.UserStatus.ACTIVE });
    }
    async findAllByTenant(tenantId, options) {
        return this.repository.find({
            where: { tenantId },
            order: { createdAt: 'DESC' },
            ...options,
        });
    }
    async deactivateAllUsers(tenantId) {
        await this.repository.update({ tenantId }, { status: User_1.UserStatus.SUSPENDED });
    }
}
exports.UserService = UserService;
//# sourceMappingURL=UserService.js.map