"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfessionalService = void 0;
const database_1 = require("../../config/database");
const ProfessionalUser_1 = require("../../entities/ProfessionalUser");
const ProfessionalTenant_1 = require("../../entities/ProfessionalTenant");
const Tenant_1 = require("../../entities/Tenant");
const User_1 = require("../../entities/User");
const logger_1 = __importDefault(require("../../utils/logger"));
class ProfessionalService {
    constructor() {
        this.professionalRepository = database_1.AppDataSource.getRepository(ProfessionalUser_1.ProfessionalUser);
        this.professionalTenantRepository = database_1.AppDataSource.getRepository(ProfessionalTenant_1.ProfessionalTenant);
        this.tenantRepository = database_1.AppDataSource.getRepository(Tenant_1.Tenant);
        this.userRepository = database_1.AppDataSource.getRepository(User_1.User);
    }
    async registerProfessional(userData, professionalData) {
        try {
            if (Array.isArray(userData)) {
                throw new Error('userData should be an object, not an array');
            }
            if (Array.isArray(professionalData)) {
                throw new Error('professionalData should be an object, not an array');
            }
            const user = await this.userRepository.save(this.userRepository.create(userData));
            const professional = await this.professionalRepository.save(this.professionalRepository.create({
                ...professionalData,
                userId: user.id
            }));
            return professional;
        }
        catch (error) {
            logger_1.default.error('Error registering professional:', error);
            throw error;
        }
    }
    async assignProfessionalToTenant(professionalId, tenantId, permissions = null) {
        try {
            const assignment = this.professionalTenantRepository.create({
                professionalId,
                tenantId,
                specificPermissions: permissions
            });
            return await this.professionalTenantRepository.save(assignment);
        }
        catch (error) {
            logger_1.default.error('Error assigning professional to tenant:', error);
            throw error;
        }
    }
    async getProfessionalTenants(professionalId) {
        try {
            const assignments = await this.professionalTenantRepository.find({
                where: { professionalId, isActive: true },
                relations: ['tenant']
            });
            return assignments.map(assignment => assignment.tenant);
        }
        catch (error) {
            logger_1.default.error('Error fetching professional tenants:', error);
            throw error;
        }
    }
    async getTenantProfessionals(tenantId) {
        try {
            const assignments = await this.professionalTenantRepository.find({
                where: { tenantId, isActive: true },
                relations: ['professional', 'professional.user']
            });
            return assignments.map(assignment => assignment.professional);
        }
        catch (error) {
            logger_1.default.error('Error fetching tenant professionals:', error);
            throw error;
        }
    }
    async updateProfessionalPermissions(professionalId, tenantId, permissions) {
        try {
            await this.professionalTenantRepository.update({ professionalId, tenantId }, { specificPermissions: permissions });
            return this.professionalTenantRepository.findOneOrFail({
                where: { professionalId, tenantId }
            });
        }
        catch (error) {
            logger_1.default.error('Error updating professional permissions:', error);
            throw error;
        }
    }
    async getProfessionalDashboard(professionalId) {
        try {
            const tenants = await this.getProfessionalTenants(professionalId);
            const complianceData = await this.getUpcomingComplianceDates(professionalId);
            const recentActivities = await this.getRecentActivities(professionalId);
            const financialSummary = await this.getFinancialSummary(professionalId);
            return {
                tenants,
                complianceData,
                recentActivities,
                financialSummary
            };
        }
        catch (error) {
            logger_1.default.error('Error fetching professional dashboard:', error);
            throw error;
        }
    }
    async getUpcomingComplianceDates(professionalId) {
        return [];
    }
    async getRecentActivities(professionalId) {
        return [];
    }
    async getFinancialSummary(professionalId) {
        return {};
    }
}
exports.ProfessionalService = ProfessionalService;
//# sourceMappingURL=ProfessionalService.js.map