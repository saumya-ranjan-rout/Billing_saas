import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { tenantMiddleware } from "../middleware/tenant";
import { NotificationController } from "../controllers/NotificationController";

const router = Router();
const controller = new NotificationController();

router.get(
    "/notification-status",
    authMiddleware,
    tenantMiddleware,
    controller.getNotificationStatus.bind(controller)
);

export default router;
