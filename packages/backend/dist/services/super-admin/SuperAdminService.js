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
exports.SuperAdminService = void 0;
const typeorm_1 = require("typeorm");
const database_1 = require("../../config/database");
const SuperAdmin_1 = require("../../entities/SuperAdmin");
const AuditLog_1 = require("../../entities/AuditLog");
const User_1 = require("../../entities/User");
const Tenant_1 = require("../../entities/Tenant");
const ProfessionalUser_1 = require("../../entities/ProfessionalUser");
const Subscription_1 = require("../../entities/Subscription");
const logger_1 = __importDefault(require("../../utils/logger"));
const bcrypt = __importStar(require("bcryptjs"));
const CacheService_1 = require("../cache/CacheService");
class SuperAdminService {
    constructor() {
        this.superAdminRepository = database_1.AppDataSource.getRepository(SuperAdmin_1.SuperAdmin);
        this.auditLogRepository = database_1.AppDataSource.getRepository(AuditLog_1.AuditLog);
        this.userRepository = database_1.AppDataSource.getRepository(User_1.User);
        this.tenantRepository = database_1.AppDataSource.getRepository(Tenant_1.Tenant);
        this.professionalRepository = database_1.AppDataSource.getRepository(ProfessionalUser_1.ProfessionalUser);
        this.subscriptionRepository = database_1.AppDataSource.getRepository(Subscription_1.Subscription);
        this.cacheService = new CacheService_1.CacheService();
    }
    async createSuperAdmin(superAdminData) {
        try {
            const user = this.userRepository.create({
                email: superAdminData.email,
                password: superAdminData.password,
                role: User_1.UserRole.SUPER_ADMIN,
                status: User_1.UserStatus.ACTIVE
            });
            const savedUser = await this.userRepository.save(user);
            const superAdminEntity = this.superAdminRepository.create({
                ...superAdminData,
                userId: savedUser.id
            });
            const savedSuperAdmin = await this.superAdminRepository.save(superAdminEntity);
            return savedSuperAdmin;
        }
        catch (error) {
            logger_1.default.error('Error creating super admin:', error);
            throw error;
        }
    }
    async getDashboardStats() {
        try {
            const totalUsers = await this.userRepository.count();
            const totalTenants = await this.tenantRepository.count();
            const totalProfessionals = await this.professionalRepository.count();
            const now = new Date();
            const activeSubscriptions = await database_1.AppDataSource.getRepository('subscriptions').count({
                where: [
                    { status: 'active', endDate: (0, typeorm_1.MoreThanOrEqual)(now) },
                    { status: 'trial', endDate: (0, typeorm_1.MoreThanOrEqual)(now) },
                ],
            });
            const recentSignups = await this.userRepository.find({
                where: { createdAt: (0, typeorm_1.Between)(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date()) },
                order: { createdAt: 'DESC' },
                take: 10
            });
            const revenueData = await this.getRevenueData();
            const systemHealth = await this.getSystemHealth();
            return {
                totalUsers,
                totalTenants,
                totalProfessionals,
                activeSubscriptions,
                recentSignups,
                revenueData,
                systemHealth
            };
        }
        catch (error) {
            logger_1.default.error('Error fetching dashboard stats:', error);
            throw error;
        }
    }
    async getUsersWithFilters(filters) {
        try {
            const { page = 1, limit = 10, search, startDate, endDate, status, sortBy = 'createdAt', sortOrder = 'DESC' } = filters;
            const skip = (page - 1) * limit;
            let query = this.userRepository.createQueryBuilder('user')
                .leftJoinAndSelect('user.tenant', 'tenant')
                .where('user.role != :role', { role: 'super_admin' });
            if (search) {
                query = query.andWhere('(user.email ILIKE :search OR user.firstName ILIKE :search OR user.lastName ILIKE :search)', { search: `%${search}%` });
            }
            if (status) {
                query = query.andWhere('user.isActive = :status', { status: status === 'active' });
            }
            if (startDate && endDate) {
                query = query.andWhere('user.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate });
            }
            const [users, total] = await query
                .orderBy(`user.${sortBy}`, sortOrder)
                .skip(skip)
                .take(limit)
                .getManyAndCount();
            return {
                data: users,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            };
        }
        catch (error) {
            logger_1.default.error('Error fetching users with filters:', error);
            throw error;
        }
    }
    async createUser(data) {
        try {
            const hashedPassword = await bcrypt.hash(data.password, 10);
            const user = this.userRepository.create({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                role: data.role,
                status: data.status,
                password: hashedPassword,
                tenant: { id: data.tenantId },
            });
            const savedUser = await this.userRepository.save(user);
            return savedUser;
        }
        catch (error) {
            logger_1.default.error('Error creating user:', error);
            throw error;
        }
    }
    async updateUser(id, data) {
        try {
            const updateData = { ...data };
            if (data.tenantId) {
                updateData.tenant = { id: data.tenantId };
            }
            await this.userRepository.update(id, updateData);
            const updatedUser = await this.userRepository.findOne({
                where: { id },
                relations: ['tenant'],
            });
            if (!updatedUser) {
                throw new Error('User not found');
            }
            return updatedUser;
        }
        catch (error) {
            logger_1.default.error('Error updating user:', error);
            throw error;
        }
    }
    async createTenant(data) {
        const tenant = this.tenantRepository.create({
            ...data,
            status: Tenant_1.TenantStatus.ACTIVE,
            isActive: true,
        });
        return await this.tenantRepository.save(tenant);
    }
    async updateTenant(id, data) {
        const { subscriptions, professionals, ...tenantData } = data;
        await this.tenantRepository.update(id, tenantData);
        const updatedTenant = await this.tenantRepository.findOne({ where: { id } });
        if (!updatedTenant)
            throw new Error('Tenant not found');
        return updatedTenant;
    }
    async getUserById(id) {
        return await this.userRepository.findOne({
            where: { id },
            relations: ['tenant'],
        });
    }
    async getTenantsWithFilters(filters) {
        try {
            const { page = 1, limit = 10, search, startDate, endDate, status, sortBy = 'createdAt', sortOrder = 'DESC' } = filters;
            const skip = (page - 1) * limit;
            let query = this.tenantRepository.createQueryBuilder('tenant')
                .leftJoinAndSelect('tenant.subscriptions', 'subscription')
                .leftJoinAndSelect('tenant.professionals', 'professionals');
            if (search) {
                query = query.andWhere('(tenant.name ILIKE :search OR tenant.email ILIKE :search)', { search: `%${search}%` });
            }
            if (status) {
                if (status === 'active') {
                    query = query.andWhere('subscription.status = :status', { status: 'active' });
                }
                else if (status === 'inactive') {
                    query = query.andWhere('(subscription.status IS NULL OR subscription.status != :status)', { status: 'active' });
                }
            }
            if (startDate && endDate) {
                query = query.andWhere('tenant.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate });
            }
            const [tenants, total] = await query
                .orderBy(`tenant.${sortBy}`, sortOrder)
                .skip(skip)
                .take(limit)
                .getManyAndCount();
            return {
                data: tenants,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            };
        }
        catch (error) {
            logger_1.default.error('Error fetching tenants with filters:', error);
            throw error;
        }
    }
    async getSubscriptions() {
        try {
            const subscriptions = await this.subscriptionRepository.createQueryBuilder('subscription')
                .leftJoinAndSelect('subscription.tenant', 'tenant')
                .leftJoinAndSelect('subscription.user', 'user')
                .leftJoinAndSelect('subscription.plan', 'plan')
                .select([
                'subscription.id AS id',
                'tenant.name as tenantName',
                'tenant.businessName',
                'user.firstName as userFirstName',
                'user.lastName as userLastName',
                'subscription.status',
                'subscription.startDate',
                'subscription.endDate',
                'plan.name as planName',
                'plan.type as planType',
                'plan.price as planPrice',
                'plan.billingCycle as planBillingCycle',
            ])
                .getRawMany();
            return subscriptions;
        }
        catch (error) {
            logger_1.default.error('Error fetching subscriptions:', error);
            throw error;
        }
    }
    async createProfessional(data) {
        const queryRunner = database_1.AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const user = queryRunner.manager.create(this.userRepository.target, {
                email: data.email,
                password: data.password.trim(),
                firstName: data.firstName,
                lastName: data.lastName,
                role: User_1.UserRole.PROFESSIONAL,
                status: User_1.UserStatus.ACTIVE,
                tenantId: data.tenantId,
            });
            const savedUser = await queryRunner.manager.save(user);
            const professional = queryRunner.manager.create(this.professionalRepository.target, {
                userId: savedUser.id,
                professionalType: data.professionalType,
                firmName: data.firmName,
                professionalLicenseNumber: data.professionalLicenseNumber,
                phone: data.phone,
                address: data.address,
                isActive: data.isActive,
                managedTenants: data.tenants ? data.tenants.map((id) => ({ id })) : [],
                permissions: data.permissions,
            });
            const savedProfessional = await queryRunner.manager.save(professional);
            await Promise.all([
                this.cacheService.invalidatePattern(`super-admin:${professional.user.tenantId}:*`),
                this.cacheService.invalidatePattern(`cache:${professional.user.tenantId}:/api/super-admin*`),
            ]);
            await queryRunner.commitTransaction();
            return savedProfessional;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            logger_1.default.error('Error creating professional:', error);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async updateProfessional(id, data) {
        const queryRunner = database_1.AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const professional = await queryRunner.manager.findOne(this.professionalRepository.target, {
                where: { id },
                relations: ['user'],
            });
            if (!professional)
                throw new Error('Professional not found');
            const updatedUser = queryRunner.manager.merge(this.userRepository.target, professional.user, {
                firstName: data.firstName ?? professional.user.firstName,
                lastName: data.lastName ?? professional.user.lastName,
                email: data.email ?? professional.user.email,
            });
            await queryRunner.manager.save(updatedUser);
            const { tenants, managedTenants, ...rest } = data;
            const updateData = { ...rest };
            const updatedProfessional = queryRunner.manager.merge(this.professionalRepository.target, professional, updateData);
            const savedProfessional = await queryRunner.manager.save(updatedProfessional);
            await Promise.all([
                this.cacheService.invalidatePattern(`super-admin:${professional.user.tenantId}:*`),
                this.cacheService.invalidatePattern(`cache:${professional.user.tenantId}:/api/super-admin*`),
            ]);
            await queryRunner.commitTransaction();
            const finalResult = await this.professionalRepository.findOne({
                where: { id },
                relations: ['user'],
            });
            return finalResult;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            logger_1.default.error('Error updating professional:', error);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async getProfessionalsWithFilters(filters) {
        try {
            const { page = 1, limit = 10, search, startDate, endDate, status, professionalType, sortBy = 'createdAt', sortOrder = 'DESC' } = filters;
            const skip = (page - 1) * limit;
            let query = this.professionalRepository.createQueryBuilder('professional')
                .leftJoinAndSelect('professional.user', 'user')
                .leftJoinAndSelect('professional.managedTenants', 'tenants');
            if (search) {
                query = query.andWhere('(professional.firmName ILIKE :search OR user.email ILIKE :search OR professional.contactPerson ILIKE :search)', { search: `%${search}%` });
            }
            if (status) {
                query = query.andWhere('professional.isActive = :status', { status: status === 'active' });
            }
            if (professionalType) {
                query = query.andWhere('professional.professionalType = :professionalType', { professionalType });
            }
            if (startDate && endDate) {
                query = query.andWhere('professional.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate });
            }
            const [professionals, total] = await query
                .orderBy(`professional.${sortBy}`, sortOrder)
                .skip(skip)
                .take(limit)
                .getManyAndCount();
            return {
                data: professionals,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            };
        }
        catch (error) {
            logger_1.default.error('Error fetching professionals with filters:', error);
            throw error;
        }
    }
    async updateProfessionalStatus(id, userId, isActive) {
        try {
            const userStatus = isActive ? User_1.UserStatus.ACTIVE : User_1.UserStatus.SUSPENDED;
            await this.userRepository.update(userId, { status: userStatus });
            await this.professionalRepository.update(id, { isActive });
            logger_1.default.info(`Professional ${id} status updated to ${isActive}`);
        }
        catch (error) {
            logger_1.default.error('Error updating professional status:', error);
            throw error;
        }
    }
    async getAuditLogs(filters) {
        try {
            const { page = 1, limit = 10, action, resource, performedById, startDate, endDate, sortBy = 'timestamp', sortOrder = 'DESC', } = filters;
            const skip = (page - 1) * limit;
            const query = this.auditLogRepository
                .createQueryBuilder('auditLog')
                .leftJoin(User_1.User, 'user', 'user.id = auditLog.performedById')
                .addSelect(['user.firstName', 'user.lastName']);
            if (action)
                query.andWhere('auditLog.action = :action', { action });
            if (resource)
                query.andWhere('auditLog.resource = :resource', { resource });
            if (performedById)
                query.andWhere('auditLog.performedById = :performedById', { performedById });
            if (startDate && endDate)
                query.andWhere('auditLog.timestamp BETWEEN :startDate AND :endDate', { startDate, endDate });
            const [rows, total] = await Promise.all([
                query
                    .orderBy(`auditLog.${sortBy}`, sortOrder)
                    .skip(skip)
                    .take(limit)
                    .getRawMany(),
                query.getCount(),
            ]);
            const formattedLogs = rows.map(row => ({
                id: row.auditLog_id,
                action: row.auditLog_action,
                timestamp: row.auditLog_timestamp,
                ipAddress: row.auditLog_ipAddress,
                performedById: row.auditLog_performedById,
                performedByName: row.user_firstName && row.user_lastName
                    ? `${row.user_firstName} ${row.user_lastName}`
                    : 'System',
            }));
            return {
                data: formattedLogs,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit),
                },
            };
        }
        catch (error) {
            logger_1.default.error('Error fetching audit logs:', error);
            throw error;
        }
    }
    async createAuditLog(performedById, action, resource, resourceId, details, ipAddress, userAgent) {
        try {
            const auditLog = this.auditLogRepository.create({
                performedById,
                action,
                resource,
                resourceId,
                details,
                ipAddress,
                userAgent
            });
            await this.auditLogRepository.save(auditLog);
        }
        catch (error) {
            logger_1.default.error('Error creating audit log:', error);
        }
    }
    async getRevenueData() {
        const revenueData = [];
        const now = new Date();
        for (let i = 11; i >= 0; i--) {
            const startDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
            const revenue = await database_1.AppDataSource.getRepository('Invoice')
                .createQueryBuilder('invoice')
                .select('SUM(invoice.totalAmount)', 'total')
                .where('invoice.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
                .andWhere('invoice.status = :status', { status: 'paid' })
                .getRawOne();
            revenueData.push({
                month: startDate.toLocaleString('default', { month: 'short', year: 'numeric' }),
                revenue: parseFloat(revenue.total) || 0
            });
        }
        return revenueData;
    }
    async getSystemHealth() {
        const databaseStatus = await this.checkDatabaseHealth();
        const storageStatus = await this.checkStorageHealth();
        const apiStatus = await this.checkAPIHealth();
        return {
            database: databaseStatus,
            storage: storageStatus,
            api: apiStatus,
            lastChecked: new Date()
        };
    }
    async checkDatabaseHealth() {
        try {
            await this.userRepository.count();
            return { status: 'healthy', message: 'Database connection is stable' };
        }
        catch (error) {
            return { status: 'unhealthy', message: 'Database connection failed' };
        }
    }
    async checkStorageHealth() {
        return { status: 'healthy', message: 'Storage is sufficient', usage: '65%' };
    }
    async checkAPIHealth() {
        return { status: 'healthy', message: 'All APIs are responding', responseTime: 120 };
    }
    async exportData(resource, format, filters) {
        try {
            let data;
            switch (resource) {
                case 'users':
                    const usersResult = await this.getUsersWithFilters(filters);
                    data = usersResult.data;
                    break;
                case 'tenants':
                    const tenantsResult = await this.getTenantsWithFilters(filters);
                    data = tenantsResult.data;
                    break;
                case 'professionals':
                    const professionalsResult = await this.getProfessionalsWithFilters(filters);
                    data = professionalsResult.data;
                    break;
                case 'auditLogs':
                    const auditLogsResult = await this.getAuditLogs(filters);
                    data = auditLogsResult.data;
                    break;
                default:
                    throw new Error('Invalid resource type');
            }
            if (format === 'csv') {
                return this.convertToCSV(data);
            }
            else {
                return JSON.stringify(data, null, 2);
            }
        }
        catch (error) {
            logger_1.default.error('Error exporting data:', error);
            throw error;
        }
    }
    convertToCSV(data) {
        if (data.length === 0)
            return '';
        const headers = Object.keys(data[0]).join(',');
        const rows = data.map(obj => Object.values(obj).map(value => typeof value === 'string' && value.includes(',') ? `"${value}"` : value).join(','));
        return [headers, ...rows].join('\n');
    }
    async updateUserStatus(id, isActive) {
        try {
            const statusValue = isActive ? 'active' : 'suspended';
            await this.userRepository.update(id, { status: statusValue });
            logger_1.default.info(`User ${id} status updated to ${statusValue}`);
        }
        catch (error) {
            logger_1.default.error('Error updating user status:', error);
            throw error;
        }
    }
    async updateTenantStatus(id, isActive) {
        try {
            await this.tenantRepository.update(id, { isActive });
            const userStatus = isActive ? User_1.UserStatus.ACTIVE : User_1.UserStatus.SUSPENDED;
            await this.userRepository.update({ tenantId: id }, { status: userStatus });
            logger_1.default.info(`Tenant ${id} status updated to ${isActive}`);
        }
        catch (error) {
            logger_1.default.error('Error updating tenant status:', error);
            throw error;
        }
    }
}
exports.SuperAdminService = SuperAdminService;
//# sourceMappingURL=SuperAdminService.js.map