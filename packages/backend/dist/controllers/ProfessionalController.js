"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfessionalController = void 0;
const database_1 = require("../config/database");
const ProfessionalUser_1 = require("../entities/ProfessionalUser");
const Tenant_1 = require("../entities/Tenant");
class ProfessionalController {
    static async registerProfessional(req, res) {
        try {
            const repo = database_1.AppDataSource.getRepository(ProfessionalUser_1.ProfessionalUser);
            const professional = repo.create(req.body);
            await repo.save(professional);
            return res.json({
                success: true,
                message: 'Professional registered successfully',
                data: professional,
            });
        }
        catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
    static async getDashboard(req, res) {
        try {
            const professionalId = req.professional?.id;
            return res.json({
                success: true,
                data: {
                    professionalId,
                    stats: {
                        tenants: 12,
                        filingsDue: 4,
                        completed: 27,
                    },
                },
            });
        }
        catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
    static async getManagedTenants(req, res) {
        try {
            const professionalId = req.professional?.id;
            const repo = database_1.AppDataSource.getRepository(ProfessionalUser_1.ProfessionalUser);
            const professional = await repo.findOne({
                where: { id: professionalId },
                relations: ['managedTenants'],
            });
            return res.json({
                success: true,
                data: professional?.managedTenants || [],
            });
        }
        catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
    static async assignToTenant(req, res) {
        try {
            const { tenantId } = req.params;
            const professionalId = req.professional?.id;
            const professionalRepo = database_1.AppDataSource.getRepository(ProfessionalUser_1.ProfessionalUser);
            const tenantRepo = database_1.AppDataSource.getRepository(Tenant_1.Tenant);
            const professional = await professionalRepo.findOne({
                where: { id: professionalId },
                relations: ['managedTenants'],
            });
            const tenant = await tenantRepo.findOne({ where: { id: tenantId } });
            if (!professional) {
                return res.status(404).json({ success: false, error: "Professional not found" });
            }
            if (!tenant) {
                return res.status(404).json({ success: false, error: "Tenant not found" });
            }
            const alreadyAssigned = professional.managedTenants.some(t => t.id === tenantId);
            if (!alreadyAssigned) {
                professional.managedTenants.push(tenant);
            }
            await professionalRepo.save(professional);
            return res.json({
                success: true,
                message: "Assigned to tenant successfully",
                data: professional,
            });
        }
        catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
}
exports.ProfessionalController = ProfessionalController;
//# sourceMappingURL=ProfessionalController.js.map