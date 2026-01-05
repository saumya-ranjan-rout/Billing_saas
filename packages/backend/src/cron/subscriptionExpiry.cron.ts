import cron from "node-cron";
import cluster from "cluster";
import logger from "../utils/logger";
import { SubscriptionExpiryService } from "../services/SubscriptionExpiryService";

export const startSubscriptionExpiryCron = () => {
    // IMPORTANT: run only in ONE process
    if (cluster.isWorker && process.env.NODE_ENV === "production") {
        return;
    }

    // Run once every day at 9:00 AM
    cron.schedule("0 9 * * *", async () => {
        try {
            logger.info("⏰ Running subscription expiry job");

            const service = new SubscriptionExpiryService();
            const result = await service.run();

            logger.info("✅ Subscription expiry job completed", result);
        } catch (error) {
            logger.error("❌ Subscription expiry job failed", error);
        }
    });
};
