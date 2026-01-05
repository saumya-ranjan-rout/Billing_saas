"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startSubscriptionExpiryCron = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const cluster_1 = __importDefault(require("cluster"));
const logger_1 = __importDefault(require("../utils/logger"));
const SubscriptionExpiryService_1 = require("../services/SubscriptionExpiryService");
const startSubscriptionExpiryCron = () => {
    if (cluster_1.default.isWorker && process.env.NODE_ENV === "production") {
        return;
    }
    node_cron_1.default.schedule("0 9 * * *", async () => {
        try {
            logger_1.default.info("⏰ Running subscription expiry job");
            const service = new SubscriptionExpiryService_1.SubscriptionExpiryService();
            const result = await service.run();
            logger_1.default.info("✅ Subscription expiry job completed", result);
        }
        catch (error) {
            logger_1.default.error("❌ Subscription expiry job failed", error);
        }
    });
};
exports.startSubscriptionExpiryCron = startSubscriptionExpiryCron;
//# sourceMappingURL=subscriptionExpiry.cron.js.map