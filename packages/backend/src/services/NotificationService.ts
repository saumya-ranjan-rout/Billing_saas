import { LessThanOrEqual, MoreThanOrEqual, MoreThan } from "typeorm";
import { AppDataSource } from "../config/database";
import { Subscription } from "../entities/Subscription";
import { Customer } from "../entities/Customer";
import { EmailService } from "./external/EmailService";

export class NotificationService {
  private subscriptionRepo = AppDataSource.getRepository(Subscription);
  private customerRepo = AppDataSource.getRepository(Customer);
  private emailService: EmailService;

  constructor() {
    this.emailService = new EmailService(); // ✅ correct place
  }

  async getNotificationStatus(userId: string, tenantId: string) {
    const items: { type: string; message: string }[] = [];
    const now = new Date();

    // 1️⃣ Request notifications
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

    // 2️⃣ Current active subscription
    const activeSubscription = await this.subscriptionRepo.findOne({
      where: {
        tenantId,
        startDate: LessThanOrEqual(now),
        endDate: MoreThanOrEqual(now),
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

    // 3️⃣ Check if a future subscription already exists
    const futureSubscription = await this.subscriptionRepo.findOne({
      where: {
        tenantId,
        startDate: MoreThanOrEqual(activeSubscription.endDate),
      },
      order: { startDate: "ASC" },
    });

    // 🚫 Skip expiry warning if future plan exists
    if (futureSubscription) {
      return { hasNotification: items.length > 0, items };
    }

    // 4️⃣ Expiry warning only when no future plan
    const diffDays = Math.ceil(
      (activeSubscription.endDate.getTime() - now.getTime()) /
      (1000 * 60 * 60 * 24)
    );

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

  // async getNotificationStatus_old(userId: string, tenantId: string) {
  //   const items: { type: string; message: string }[] = [];
  //   // -----------------------------
  //   // 1️⃣ REQUEST NOTIFICATION
  //   // -----------------------------
  //   const pendingRequest = await this.customerRepo.findOne({
  //     where: {
  //       requestedTo: { id: userId },
  //       status: "Pending",
  //     },
  //   });

  //   if (pendingRequest) {
  //     items.push({
  //       type: "REQUEST",
  //       message: "You have a new connection request",
  //     });
  //   }

  //   // -----------------------------
  //   // 2️⃣ SUBSCRIPTION NOTIFICATION
  //   // -----------------------------
  //   const now = new Date();

  //   const activeSubscription = await this.subscriptionRepo.findOne({
  //     where: {
  //       tenantId,
  //       startDate: LessThanOrEqual(now),
  //       endDate: MoreThanOrEqual(now),
  //     },
  //     order: { endDate: "ASC" }, // safety if overlap exists
  //   });

  //   // No active subscription
  //   if (!activeSubscription) {
  //     return {
  //       showNotification: true,
  //       message: "No active subscription. Please subscribe.",
  //     };
  //   }

  //   const endDate = activeSubscription.endDate as Date;

  //   const diffInMs = endDate.getTime() - now.getTime();
  //   const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

  //   // Expiring soon
  //   if (diffInDays <= 3) {
  //     return {
  //       showNotification: true,
  //       message: `Your current plan expires in ${diffInDays} day(s).`,
  //     };
  //   }

  //   return {
  //     showNotification: false,
  //     message: "",
  //   };
  // }
}
