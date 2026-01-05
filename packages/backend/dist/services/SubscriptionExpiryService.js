"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionExpiryService = void 0;
const typeorm_1 = require("typeorm");
const database_1 = require("../config/database");
const Subscription_1 = require("../entities/Subscription");
const EmailService_1 = require("./external/EmailService");
const redis_1 = require("../config/redis");
class SubscriptionExpiryService {
    constructor() {
        this.subRepo = database_1.AppDataSource.getRepository(Subscription_1.Subscription);
        this.emailService = new EmailService_1.EmailService();
    }
    async run() {
        const now = new Date();
        let sent = 0;
        const subscriptions = await this.subRepo.find({
            where: {
                startDate: (0, typeorm_1.LessThanOrEqual)(now),
                endDate: (0, typeorm_1.MoreThanOrEqual)(new Date(now.getTime() - 24 * 60 * 60 * 1000)),
            },
            relations: ["user"],
        });
        for (const sub of subscriptions) {
            const emailSent = await this.processSubscription(sub, now);
            if (emailSent)
                sent++;
        }
        return {
            processed: subscriptions.length,
            sent,
        };
    }
    async processSubscription(sub, now) {
        const futureSub = await this.subRepo.findOne({
            where: {
                tenantId: sub.tenantId,
                startDate: (0, typeorm_1.MoreThanOrEqual)(sub.endDate),
            },
        });
        if (futureSub)
            return false;
        const diffDays = Math.ceil((sub.endDate.getTime() - now.getTime()) /
            (1000 * 60 * 60 * 24));
        if (![7, 3, 0].includes(diffDays))
            return false;
        const redisKey = `expiry-mail:${sub.id}:${diffDays}`;
        const alreadySent = await redis_1.redis.get(redisKey);
        if (alreadySent)
            return false;
        await this.emailService.sendSubscriptionExpiryMail({
            to: sub.user.email,
            daysLeft: diffDays,
            endDate: sub.endDate,
        });
        await redis_1.redis.set(redisKey, "1");
        await redis_1.redis.expire(redisKey, 60 * 60 * 24);
        return true;
    }
}
exports.SubscriptionExpiryService = SubscriptionExpiryService;
//# sourceMappingURL=SubscriptionExpiryService.js.map