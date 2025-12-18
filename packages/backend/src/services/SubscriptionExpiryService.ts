import { LessThanOrEqual, MoreThan, MoreThanOrEqual } from "typeorm";
import { AppDataSource } from "../config/database";
import { Subscription } from "../entities/Subscription";
import { EmailService } from "./external/EmailService";
import { redis } from "../config/redis"; // or any cache

export class SubscriptionExpiryService {
    private subRepo = AppDataSource.getRepository(Subscription);
    private emailService = new EmailService();

    async run() {
        const now = new Date();
        let sent = 0;

        // Active or just-expired subscriptions
        const subscriptions = await this.subRepo.find({
            where: {
                startDate: LessThanOrEqual(now),
                endDate: MoreThanOrEqual(
                    new Date(now.getTime() - 24 * 60 * 60 * 1000)
                ),
            },
            relations: ["user"],
        });

        for (const sub of subscriptions) {
            const emailSent = await this.processSubscription(sub, now);
            if (emailSent) sent++;
        }

        return {
            processed: subscriptions.length,
            sent,
        };
    }

    private async processSubscription(sub: Subscription, now: Date) {
        // 1️⃣ Skip if future subscription exists
        const futureSub = await this.subRepo.findOne({
            where: {
                tenantId: sub.tenantId,
                startDate: MoreThanOrEqual(sub.endDate),
            },
        });

        if (futureSub) return false;

        // 2️⃣ Days left
        const diffDays = Math.ceil(
            (sub.endDate.getTime() - now.getTime()) /
            (1000 * 60 * 60 * 24)
        );

        if (![7, 3, 0].includes(diffDays)) return false;

        // 3️⃣ Prevent duplicate email
        const redisKey = `expiry-mail:${sub.id}:${diffDays}`;
        const alreadySent = await redis.get(redisKey);

        if (alreadySent) return false;

        // 4️⃣ Send email
        await this.emailService.sendSubscriptionExpiryMail({
            to: sub.user.email,
            daysLeft: diffDays,
            endDate: sub.endDate,
        });

        // 5️⃣ Mark as sent (24h lock)
        // await redis.set(redisKey, "1", { EX: 60 * 60 * 24 });
        await redis.set(redisKey, "1");
        await redis.expire(redisKey, 60 * 60 * 24);

        return true;
    }
}
