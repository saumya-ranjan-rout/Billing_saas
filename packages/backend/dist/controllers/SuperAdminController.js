"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperAdminController = void 0;
const SuperAdminService_1 = require("../services/super-admin/SuperAdminService");
const AuditLog_1 = require("../entities/AuditLog");
const superAdminService = new SuperAdminService_1.SuperAdminService();
class SuperAdminController {
    static async getDashboard(req, res) {
        try {
            const stats = await superAdminService.getDashboardStats();
            await superAdminService.createAuditLog(req.superAdmin?.id || 'unknown', AuditLog_1.AuditAction.LOGIN, AuditLog_1.AuditResource.SYSTEM, 'dashboard', { action: 'viewed dashboard' }, req.ip, req.get('User-Agent'));
            res.json(stats);
        }
        catch (error) {
            res.status(500).json({ error: error?.message || 'Internal server error' });
        }
    }
    static async getUsers(req, res) {
        try {
            const filters = {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 10,
                search: req.query.search,
                startDate: req.query.startDate ? new Date(req.query.startDate) : undefined,
                endDate: req.query.endDate ? new Date(req.query.endDate) : undefined,
                status: req.query.status,
                sortBy: req.query.sortBy || 'createdAt',
                sortOrder: req.query.sortOrder || 'DESC'
            };
            const result = await superAdminService.getUsersWithFilters(filters);
            await superAdminService.createAuditLog(req.superAdmin?.id || 'unknown', AuditLog_1.AuditAction.LOGIN, AuditLog_1.AuditResource.USER, 'multiple', { action: 'viewed users', filters }, req.ip, req.get('User-Agent'));
            res.json(result);
        }
        catch (error) {
            res.status(500).json({ error: error?.message || 'Internal server error' });
        }
    }
    static async createUser(req, res) {
        try {
            const { firstName, lastName, email, role, status, password, tenant } = req.body;
            console.log('Creating user:', { firstName, lastName, email, role, status, tenant });
            const tenantId = tenant.id;
            const user = await superAdminService.createUser({ firstName, lastName, email, role, status, password, tenantId });
            await superAdminService.createAuditLog(req.superAdmin?.id || 'unknown', AuditLog_1.AuditAction.CREATE, AuditLog_1.AuditResource.USER, user.id, { action: 'created user under tenant', tenantId }, req.ip, req.get('User-Agent'));
            res.status(201).json(user);
        }
        catch (error) {
            res.status(500).json({ error: error?.message || 'Internal server error' });
        }
    }
    static async updateUser(req, res) {
        try {
            const { id } = req.params;
            const { firstName, lastName, email, role, status, tenantId } = req.body;
            const updatedUser = await superAdminService.updateUser(id, { firstName, lastName, email, role, status, tenantId });
            await superAdminService.createAuditLog(req.superAdmin?.id || 'unknown', AuditLog_1.AuditAction.UPDATE, AuditLog_1.AuditResource.USER, id, { action: 'updated user under tenant', tenantId }, req.ip, req.get('User-Agent'));
            res.json(updatedUser);
        }
        catch (error) {
            res.status(500).json({ error: error?.message || 'Internal server error' });
        }
    }
    static async createTenant(req, res) {
        try {
            const tenant = await superAdminService.createTenant(req.body);
            res.status(201).json(tenant);
        }
        catch (error) {
            res.status(500).json({ error: error.message || 'Error creating tenant' });
        }
    }
    static async updateTenant(req, res) {
        try {
            const { id } = req.params;
            const tenant = await superAdminService.updateTenant(id, req.body);
            res.json(tenant);
        }
        catch (error) {
            res.status(500).json({ error: error.message || 'Error updating tenant' });
        }
    }
    static async getUserById(req, res) {
        try {
            const { id } = req.params;
            const user = await superAdminService.getUserById(id);
            res.json(user);
        }
        catch (error) {
            res.status(500).json({ error: error?.message || 'Internal server error' });
        }
    }
    static async getTenants(req, res) {
        try {
            const filters = {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 10,
                search: req.query.search,
                startDate: req.query.startDate ? new Date(req.query.startDate) : undefined,
                endDate: req.query.endDate ? new Date(req.query.endDate) : undefined,
                status: req.query.status,
                sortBy: req.query.sortBy || 'createdAt',
                sortOrder: req.query.sortOrder || 'DESC'
            };
            const result = await superAdminService.getTenantsWithFilters(filters);
            await superAdminService.createAuditLog(req.superAdmin?.id || 'unknown', AuditLog_1.AuditAction.LOGIN, AuditLog_1.AuditResource.TENANT, 'multiple', { action: 'viewed tenants', filters }, req.ip, req.get('User-Agent'));
            res.json(result);
        }
        catch (error) {
            res.status(500).json({ error: error?.message || 'Internal server error' });
        }
    }
    static async getSubscriptions(req, res) {
        try {
            const subscriptions = await superAdminService.getSubscriptions();
            res.json({ data: subscriptions });
        }
        catch (error) {
            res.status(500).json({ error: error?.message || 'Internal server error' });
        }
    }
    static async createProfessional(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const tenantId = req.user.tenantId;
            const data = {
                ...req.body,
                tenantId,
            };
            const professional = await superAdminService.createProfessional(data);
            await superAdminService.createAuditLog(req.superAdmin?.id || 'unknown', AuditLog_1.AuditAction.CREATE, AuditLog_1.AuditResource.PROFESSIONAL, professional.id, { action: 'created professional' }, req.ip, req.get('User-Agent'));
            return res.status(201).json(professional);
        }
        catch (error) {
            return res.status(500).json({ error: error?.message || 'Internal server error' });
        }
    }
    static async updateProfessional(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;
            const updatedProfessional = await superAdminService.updateProfessional(id, data);
            await superAdminService.createAuditLog(req.superAdmin?.id || 'unknown', AuditLog_1.AuditAction.UPDATE, AuditLog_1.AuditResource.PROFESSIONAL, id, { action: 'updated professional' }, req.ip, req.get('User-Agent'));
            res.json(updatedProfessional);
        }
        catch (error) {
            res.status(500).json({ error: error?.message || 'Internal server error' });
        }
    }
    static async getProfessionals(req, res) {
        try {
            const filters = {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 10,
                search: req.query.search,
                startDate: req.query.startDate ? new Date(req.query.startDate) : undefined,
                endDate: req.query.endDate ? new Date(req.query.endDate) : undefined,
                status: req.query.status,
                professionalType: req.query.professionalType,
                sortBy: req.query.sortBy || 'createdAt',
                sortOrder: req.query.sortOrder || 'DESC',
            };
            const result = await superAdminService.getProfessionalsWithFilters(filters);
            const professionalsWithNames = result.data.map((professional) => {
                const { firstName, lastName, email } = professional.user || {};
                return {
                    ...professional,
                    firstName,
                    lastName,
                    email
                };
            });
            res.json({ ...result, data: professionalsWithNames });
        }
        catch (error) {
            res.status(500).json({ error: error?.message || 'Internal server error' });
        }
    }
    static async updateProfessionalStatus(req, res) {
        try {
            const { id, userId } = req.params;
            const { isActive } = req.body;
            await superAdminService.updateProfessionalStatus(id, userId, isActive);
            await superAdminService.createAuditLog(req.superAdmin?.id || 'unknown', AuditLog_1.AuditAction.UPDATE, AuditLog_1.AuditResource.PROFESSIONAL, id, { action: 'updated professional status', isActive }, req.ip, req.get('User-Agent'));
            res.json({ message: 'Professional status updated successfully' });
        }
        catch (error) {
            res.status(500).json({ error: error?.message || 'Internal server error' });
        }
    }
    static async getAuditLogs(req, res) {
        try {
            const filters = {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 10,
                action: req.query.action,
                resource: req.query.resource,
                performedById: req.query.performedById,
                startDate: req.query.startDate ? new Date(req.query.startDate) : undefined,
                endDate: req.query.endDate ? new Date(req.query.endDate) : undefined,
                sortBy: req.query.sortBy || 'timestamp',
                sortOrder: req.query.sortOrder || 'DESC'
            };
            const result = await superAdminService.getAuditLogs(filters);
            res.json(result);
        }
        catch (error) {
            res.status(500).json({ error: error?.message || 'Internal server error' });
        }
    }
    static async exportData(req, res) {
        try {
            const { resource, format } = req.params;
            const filters = req.query;
            const data = await superAdminService.exportData(resource, format, filters);
            await superAdminService.createAuditLog(req.superAdmin?.id || 'unknown', AuditLog_1.AuditAction.EXPORT, resource, 'multiple', { action: 'exported data', resource, format, filters }, req.ip, req.get('User-Agent'));
            if (format === 'csv') {
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', `attachment; filename=${resource}-${new Date().toISOString()}.csv`);
            }
            else {
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Content-Disposition', `attachment; filename=${resource}-${new Date().toISOString()}.json`);
            }
            res.send(data);
        }
        catch (error) {
            res.status(500).json({ error: error?.message || 'Internal server error' });
        }
    }
    static async updateUserStatus(req, res) {
        try {
            const { id } = req.params;
            const { isActive } = req.body;
            await superAdminService.updateUserStatus(id, isActive);
            await superAdminService.createAuditLog(req.superAdmin?.id || 'unknown', AuditLog_1.AuditAction.UPDATE, AuditLog_1.AuditResource.USER, id, { action: 'updated user status', isActive }, req.ip, req.get('User-Agent'));
            res.json({ message: 'User status updated successfully' });
        }
        catch (error) {
            res.status(500).json({ error: error?.message || 'Internal server error' });
        }
    }
    static async updateTenantStatus(req, res) {
        try {
            const { id } = req.params;
            const { isActive } = req.body;
            await superAdminService.updateTenantStatus(id, isActive);
            await superAdminService.createAuditLog(req.superAdmin?.id || 'unknown', AuditLog_1.AuditAction.UPDATE, AuditLog_1.AuditResource.TENANT, id, { action: 'updated tenant status', isActive }, req.ip, req.get('User-Agent'));
            res.json({ message: 'Tenant status updated successfully' });
        }
        catch (error) {
            res.status(500).json({ error: error?.message || 'Internal server error' });
        }
    }
}
exports.SuperAdminController = SuperAdminController;
//# sourceMappingURL=SuperAdminController.js.map