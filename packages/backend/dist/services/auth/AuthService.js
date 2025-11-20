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
exports.hashPassword = exports.AuthService = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const typeorm_1 = require("typeorm");
const User_1 = require("../../entities/User");
const Tenant_1 = require("../../entities/Tenant");
const Subscription_1 = require("../../entities/Subscription");
const database_1 = require("../../config/database");
const BaseService_1 = require("../BaseService");
const errors_1 = require("../../utils/errors");
const EmailService_1 = require("../external/EmailService");
class AuthService extends BaseService_1.BaseService {
    constructor() {
        super(database_1.AppDataSource.getRepository(User_1.User));
        this.emailService = new EmailService_1.EmailService();
        this.tenantRepository = database_1.AppDataSource.getRepository(Tenant_1.Tenant);
        this.subscriptionRepository = database_1.AppDataSource.getRepository(Subscription_1.Subscription);
        this.refreshTokens = new Set();
    }
    async registerWithTenant(data) {
        const queryRunner = database_1.AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const tenantRepo = queryRunner.manager.getRepository(Tenant_1.Tenant);
            const userRepo = queryRunner.manager.getRepository(User_1.User);
            const tenant = tenantRepo.create({
                name: `${data.firstName} ${data.lastName}`,
                businessName: data.businessName ?? '',
                subdomain: data.subdomain ?? '',
                slug: data.slug ?? data.subdomain,
                accountType: data.accountType ?? '',
                professionType: data.professionType ?? '',
                licenseNo: data.licenseNo ?? '',
                pan: data.pan ?? '',
                gst: data.gst ?? '',
                status: Tenant_1.TenantStatus.ACTIVE,
                isActive: true,
            });
            const savedTenant = await tenantRepo.save(tenant);
            const hashedPassword = await bcryptjs_1.default.hash(data.password.trim(), 12);
            let userRole = User_1.UserRole.USER;
            if (data.accountType?.toLowerCase() === "admin") {
                userRole = User_1.UserRole.ADMIN;
            }
            else if (data.accountType?.toLowerCase() === "professional") {
                userRole = User_1.UserRole.PROFESSIONAL;
            }
            const user = userRepo.create({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                password: data.password.trim(),
                status: User_1.UserStatus.ACTIVE,
                role: userRole,
                tenantId: savedTenant.id,
            });
            const savedUser = await userRepo.save(user);
            await queryRunner.commitTransaction();
            return savedUser;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            console.error('Error during registerWithTenant:', error);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async register(userData, tenantId) {
        const existingUser = await this.repository.findOne({
            where: { email: userData.email, tenantId },
        });
        if (existingUser) {
            throw new errors_1.BadRequestError("User already exists");
        }
        const user = await this.create({
            ...userData,
            tenantId,
            password: userData.password
                ? await bcryptjs_1.default.hash(userData.password, 12)
                : undefined,
            status: User_1.UserStatus.INVITED,
        });
        await this.emailService.sendInvitationEmail(user.email, user.id, tenantId);
        return user;
    }
    async switchTenant(updatedPayload) {
        const user = await this.repository.findOne({
            where: { id: updatedPayload.userId }
        });
        if (!user) {
            throw new Error("User not found");
        }
        user.tenantId = updatedPayload.tenantId;
        user.role = User_1.UserRole[updatedPayload.role];
        user.firstName = updatedPayload.firstName;
        user.lastName = updatedPayload.lastName;
        await this.repository.save(user);
        const accessToken = this.generateToken(updatedPayload);
        const refreshToken = this.generateRefreshToken(updatedPayload);
        return { user, accessToken, refreshToken };
    }
    async login(email, password) {
        try {
            const user = await this.repository.findOne({
                where: {
                    email: email,
                    role: (0, typeorm_1.Not)(User_1.UserRole.SUPER_USER),
                },
                relations: ['tenant'],
            });
            if (!user || !user.password) {
                throw new errors_1.UnauthorizedError("Invalid credentials");
            }
            if (user.status !== User_1.UserStatus.ACTIVE) {
                throw new errors_1.UnauthorizedError("Account is not active");
            }
            const isValid = await bcryptjs_1.default.compare(password, user.password);
            if (!isValid) {
                throw new errors_1.UnauthorizedError("Invalid credentials");
            }
            user.lastLoginAt = new Date();
            await this.repository.save(user);
            const check_subscription = await this.subscriptionRepository.findOne({
                where: {
                    tenantId: user.tenant?.id,
                    endDate: (0, typeorm_1.MoreThanOrEqual)(new Date()),
                },
            });
            const hasActiveSubscription = check_subscription !== null;
            const rolePermissions = {
                admin: [
                    "read:customers",
                    "create:customers",
                    "update:customers",
                    "delete:customers",
                    "read:vendors",
                    "create:vendors",
                    "update:vendors",
                    "delete:vendors",
                ],
                user: ["read:customers"],
            };
            const payload = {
                userId: user.id,
                tenantId: user.tenantId,
                email: user.email,
                role: user.role,
                permissions: rolePermissions[user.role] || [],
                firstName: user.firstName,
                lastName: user.lastName,
            };
            const accessToken = this.generateToken(payload);
            const refreshToken = this.generateRefreshToken(payload);
            this.refreshTokens.add(refreshToken);
            return { user, accessToken, refreshToken, check_subscription: hasActiveSubscription };
        }
        catch (error) {
            throw error;
        }
    }
    async superUserlogin(tenantId, email, password) {
        console.log('Login attempt for email:', email, 'tenantId:', tenantId, 'password:', password);
        await this.repository.update({ email }, { tenantId });
        const user = await this.repository.findOne({
            where: {
                email: email,
                role: User_1.UserRole.SUPER_USER,
            },
            relations: ['tenant'],
        });
        if (!user || !user.password) {
            throw new errors_1.UnauthorizedError("Invalid credentials");
        }
        if (user.status !== User_1.UserStatus.ACTIVE) {
            throw new errors_1.UnauthorizedError("Account is not active");
        }
        const isValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isValid) {
            throw new errors_1.UnauthorizedError("Invalid credentials");
        }
        user.tenantId = tenantId;
        user.lastLoginAt = new Date();
        await this.repository.save(user);
        const rolePermissions = {
            admin: [
                "read:customers",
                "create:customers",
                "update:customers",
                "delete:customers",
                "read:vendors",
                "create:vendors",
                "update:vendors",
                "delete:vendors",
            ],
            user: ["read:customers"],
        };
        const payload = {
            userId: user.id,
            tenantId: user.tenantId,
            email: user.email,
            role: user.role,
            permissions: rolePermissions[user.role] || [],
            firstName: user.firstName,
            lastName: user.lastName,
        };
        const accessToken = this.generateToken(payload);
        const refreshToken = this.generateRefreshToken(payload);
        this.refreshTokens.add(refreshToken);
        return { user, accessToken, refreshToken };
    }
    async refreshToken(refreshToken) {
        if (!this.refreshTokens.has(refreshToken)) {
            throw new errors_1.UnauthorizedError("Invalid refresh token");
        }
        try {
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
            const newAccessToken = this.generateToken(decoded);
            return { accessToken: newAccessToken };
        }
        catch {
            throw new errors_1.UnauthorizedError("Invalid or expired refresh token");
        }
    }
    async logout(refreshToken) {
        this.refreshTokens.delete(refreshToken);
    }
    async changePassword(userId, currentPassword, newPassword) {
        const user = await this.findById(userId);
        const isValidPassword = await bcryptjs_1.default.compare(currentPassword, user.password);
        if (!isValidPassword) {
            throw new errors_1.UnauthorizedError("Current password is incorrect");
        }
        user.password = await bcryptjs_1.default.hash(newPassword, 12);
        await this.repository.save(user);
    }
    async resetPassword(email, tenantId) {
        const user = await this.repository.findOne({ where: { email, tenantId } });
        if (!user) {
            return;
        }
        const resetToken = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1d" });
        await this.emailService.sendPasswordResetEmail(user.email, resetToken);
    }
    async confirmResetPassword(token, newPassword) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await this.findById(decoded.userId);
            user.password = await bcryptjs_1.default.hash(newPassword, 12);
            await this.repository.save(user);
        }
        catch (error) {
            throw new errors_1.UnauthorizedError("Invalid or expired reset token");
        }
    }
    generateToken(payload) {
        return jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || "1d",
        });
    }
    generateRefreshToken(payload) {
        return jwt.sign(payload, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
        });
    }
    verifyToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        }
        catch {
            throw new errors_1.UnauthorizedError("Invalid token");
        }
    }
    async enableBiometric(userId) {
        await this.repository.update(userId, { biometricEnabled: true });
    }
    async getTenantsForUser(email) {
        const user = await this.repository.findOne({
            where: { email },
            relations: ["tenant"],
        });
        if (!user) {
            return [];
        }
        return [user.tenant];
    }
    async getTenants() {
        try {
            const tenants = await this.tenantRepository.find();
            return tenants;
        }
        catch (error) {
            throw new Error('Failed to fetch tenants');
        }
    }
}
exports.AuthService = AuthService;
const hashPassword = async (plain) => {
    return bcryptjs_1.default.hash(plain, 12);
};
exports.hashPassword = hashPassword;
//# sourceMappingURL=AuthService.js.map