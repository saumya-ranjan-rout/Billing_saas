"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
console.log("🚨 internalRoutes.ts FILE LOADED");
const express_1 = require("express");
const SubscriptionExpiryService_1 = require("../services/SubscriptionExpiryService");
const router = (0, express_1.Router)();
router.get("/run-subscription-expiry-mails", async (req, res) => {
    const secret = process.env.CRON_SECRET || "dev-secret";
    if (req.query.secret !== secret) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const service = new SubscriptionExpiryService_1.SubscriptionExpiryService();
        const result = await service.run();
        console.log("✅ internalRoutes loaded");
        res.json({
            success: true,
            processed: result.processed,
            sent: result.sent,
        });
    }
    catch (error) {
        console.error("Expiry mail job failed:", error);
        res.status(500).json({ success: false });
    }
});
exports.default = router;
//# sourceMappingURL=internalRoutes.js.map