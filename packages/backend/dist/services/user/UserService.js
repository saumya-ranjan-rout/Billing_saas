"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const typeorm_1 = require("typeorm");
const database_1 = require("../../config/database");
const User_1 = require("../../entities/User");
const logger_1 = __importDefault(require("../../utils/logger"));
const bcrypt = __importStar(require("bcryptjs"));
class UserService {
    constructor() {
        this.userRepository = database_1.AppDataSource.getRepository(User_1.User);
    }
    async createUser(tenantId, userData) {
        try {
            const existingUser = await this.userRepository.findOne({
                where: { email: userData.email, tenantId },
            });
            if (existingUser)
                throw new Error("User with this email already exists");
            const activeUsersCount = await this.userRepository.count({
                where: { status: User_1.UserStatus.ACTIVE, tenantId },
            });
            if (activeUsersCount >= 3) {
                throw new Error("Tenant already has 3 active users");
            }
            const user = this.userRepository.create({ ...userData, tenantId });
            const savedUser = await this.userRepository.save(user);
            return await this.userRepository.findOneOrFail({
                where: { id: savedUser.id },
                relations: ["tenant"],
            });
        }
        catch (error) {
            logger_1.default.error("Error creating user:", error);
            throw error;
        }
    }
    async getUser(tenantId, userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId, tenantId },
            relations: ["tenant"],
        });
        if (!user)
            throw new Error("User not found");
        return user;
    }
    async getUsers(tenantId, options) {
        const { page, limit, search } = options;
        const skip = (page - 1) * limit;
        const whereConditions = search
            ? [
                { tenantId, firstName: (0, typeorm_1.ILike)(`%${search}%`) },
                { tenantId, lastName: (0, typeorm_1.ILike)(`%${search}%`) },
                { tenantId, email: (0, typeorm_1.ILike)(`%${search}%`) },
            ]
            : { tenantId };
        const [users, total] = await this.userRepository.findAndCount({
            where: whereConditions,
            skip,
            take: limit,
            order: { createdAt: "DESC" },
        });
        return {
            data: users,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        };
    }
    async updateUser(tenantId, userId, updates) {
        const user = await this.getUser(tenantId, userId);
        Object.assign(user, updates);
        await this.userRepository.save(user);
        return this.userRepository.findOneOrFail({ where: { id: userId }, relations: ["tenant"] });
    }
    async deleteUser(tenantId, userId) {
        const user = await this.getUser(tenantId, userId);
        user.status = User_1.UserStatus.SUSPENDED;
        await this.userRepository.save(user);
    }
    async resetPassword(tenantId, userId, newPassword) {
        const user = await this.getUser(tenantId, userId);
        user.password = await bcrypt.hash(newPassword, 12);
        await this.userRepository.save(user);
        return user;
    }
}
exports.UserService = UserService;
//# sourceMappingURL=UserService.js.map