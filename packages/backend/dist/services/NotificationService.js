"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const typeorm_1 = require("typeorm");
const database_1 = require("../config/database");
const Subscription_1 = require("../entities/Subscription");
const Customer_1 = require("../entities/Customer");
const EmailService_1 = require("./external/EmailService");
class NotificationService {
    constructor() {
        this.subscriptionRepo = database_1.AppDataSource.getRepository(Subscription_1.Subscription);
        this.customerRepo = database_1.AppDataSource.getRepository(Customer_1.Customer);
        this.emailService = new EmailService_1.EmailService();
    }
    async getNotificationStatus(userId, tenantId) {
        const items = [];
        const now = new Date();
        const requestCount = await this.customerRepo.count({
            where: {
                requestedTo: { id: userId },
                status: "Pending",
            },
        });
        if (requestCount > 0) {
            items.push({
                type: "REQUEST",
                message: `You have ${requestCount} new connection request(s)`,
            });
        }
        const activeSubscription = await this.subscriptionRepo.findOne({
            where: {
                tenantId,
                startDate: (0, typeorm_1.LessThanOrEqual)(now),
                endDate: (0, typeorm_1.MoreThanOrEqual)(now),
            },
            order: { endDate: "ASC" },
        });
        if (!activeSubscription) {
            items.push({
                type: "SUBSCRIPTION",
                message: "No active subscription. Please subscribe.",
            });
            return { hasNotification: items.length > 0, items };
        }
        const futureSubscription = await this.subscriptionRepo.findOne({
            where: {
                tenantId,
                startDate: (0, typeorm_1.MoreThanOrEqual)(activeSubscription.endDate),
            },
            order: { startDate: "ASC" },
        });
        if (futureSubscription) {
            return { hasNotification: items.length > 0, items };
        }
        const diffDays = Math.ceil((activeSubscription.endDate.getTime() - now.getTime()) /
            (1000 * 60 * 60 * 24));
        if (diffDays <= 7) {
            items.push({
                type: "SUBSCRIPTION",
                message: `Subscription expires in ${diffDays} day(s).`,
            });
        }
        return {
            hasNotification: items.length > 0,
            items,
        };
    }
}
exports.NotificationService = NotificationService;
//# sourceMappingURL=NotificationService.js.map