"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.superAdminAuth = void 0;
const SuperAdmin_1 = require("../entities/SuperAdmin");
const database_1 = require("../config/database");
const superAdminAuth = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user || typeof user !== 'object') {
            return res.status(401).json({ error: 'Unauthorized: user not found' });
        }
        const userId = 'id' in user && (typeof user.id === 'string' || typeof user.id === 'number')
            ? user.id
            : null;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized: user ID missing' });
        }
        const superAdminRepository = database_1.AppDataSource.getRepository(SuperAdmin_1.SuperAdmin);
        const superAdmin = await superAdminRepository.findOne({
            where: { userId },
            relations: ['user'],
        });
        if (!superAdmin) {
            return res.status(403).json({ error: 'User is not a super admin' });
        }
        if (!superAdmin.is_active) {
            return res.status(403).json({ error: 'Super admin account is not active' });
        }
        req.superAdmin = superAdmin;
        next();
    }
    catch (error) {
        console.error('superAdminAuth error:', error);
        res.status(500).json({ error: 'Super admin authentication failed' });
    }
};
exports.superAdminAuth = superAdminAuth;
//# sourceMappingURL=superAdminAuth.js.map