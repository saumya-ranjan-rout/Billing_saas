"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkSubscription = void 0;
const database_1 = require("../config/database");
const Subscription_1 = require("../entities/Subscription");
const typeorm_1 = require("typeorm");
const checkSubscription = async (req, res, next) => {
    try {
        const tenantId = req.user?.tenantId;
        if (!tenantId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const subscriptionRepo = database_1.AppDataSource.getRepository(Subscription_1.Subscription);
        const now = new Date();
        const sub = await subscriptionRepo.findOne({
            where: {
                tenantId,
                status: (0, typeorm_1.In)(['active', 'trial']),
                endDate: (0, typeorm_1.MoreThan)(now),
            },
            order: { endDate: 'DESC' },
        });
        if (!sub) {
            return res.status(403).json({ message: 'Your subscription has expired or not found.' });
        }
        next();
    }
    catch (err) {
        console.error('Subscription check error:', err);
        return res.status(500).json({ message: 'Error verifying subscription status.' });
    }
};
exports.checkSubscription = checkSubscription;
//# sourceMappingURL=checkSubscription.js.map