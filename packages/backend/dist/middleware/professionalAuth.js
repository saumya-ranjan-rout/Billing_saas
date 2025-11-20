"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.professionalAuth = void 0;
const ProfessionalUser_1 = require("../entities/ProfessionalUser");
const database_1 = require("../config/database");
const professionalAuth = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const professionalRepository = database_1.AppDataSource.getRepository(ProfessionalUser_1.ProfessionalUser);
        const professional = await professionalRepository.findOne({
            where: { userId },
            relations: ['managedTenants']
        });
        if (!professional) {
            return res.status(403).json({ error: 'User is not registered as a professional' });
        }
        if (!professional.isActive) {
            return res.status(403).json({ error: 'Professional account is not active' });
        }
        req.professional = professional;
        if (req.params.tenantId) {
            const hasAccess = professional.managedTenants.some(tenant => tenant.id === req.params.tenantId);
            if (!hasAccess) {
                return res.status(403).json({ error: 'Professional does not have access to this tenant' });
            }
        }
        next();
    }
    catch (error) {
        res.status(500).json({ error: 'Professional authentication failed' });
    }
};
exports.professionalAuth = professionalAuth;
//# sourceMappingURL=professionalAuth.js.map