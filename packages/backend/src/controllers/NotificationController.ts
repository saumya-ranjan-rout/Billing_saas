import { Request, Response } from "express";
import { NotificationService } from "services/NotificationService";

export class NotificationController {
  private notificationService = new NotificationService();

  async getNotificationStatus(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const tenantId = req.user?.tenantId;

      if (!userId || !tenantId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const data = await this.notificationService.getNotificationStatus(userId, tenantId);
      res.json(data);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
}
