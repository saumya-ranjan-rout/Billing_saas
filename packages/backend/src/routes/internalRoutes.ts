console.log("🚨 internalRoutes.ts FILE LOADED");
import { Router } from "express";
import { SubscriptionExpiryService } from "../services/SubscriptionExpiryService";

const router = Router();

router.get("/run-subscription-expiry-mails", async (req, res) => {
    // if (req.query.secret !== process.env.CRON_SECRET) {
    //     return res.status(401).json({ message: "Unauthorized" });
    // }
    const secret = process.env.CRON_SECRET || "dev-secret";

    if (req.query.secret !== secret) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const service = new SubscriptionExpiryService();
        const result = await service.run();

        console.log("✅ internalRoutes loaded");

        res.json({
            success: true,
            processed: result.processed,
            sent: result.sent,
        });
    } catch (error) {
        console.error("Expiry mail job failed:", error);
        res.status(500).json({ success: false });
    }
});

export default router;
