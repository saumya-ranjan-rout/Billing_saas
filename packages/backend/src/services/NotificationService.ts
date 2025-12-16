import { LessThanOrEqual, MoreThanOrEqual, MoreThan } from "typeorm";
import { AppDataSource } from "../config/database";
import { Subscription } from "../entities/Subscription";
import { Customer } from "../entities/Customer";

export class NotificationService {
  private subscriptionRepo = AppDataSource.getRepository(Subscription);
  private customerRepo = AppDataSource.getRepository(Customer);

  async getNotificationStatus_old(userId: string, tenantId: string) {
    const items: { type: string; message: string }[] = [];
    // -----------------------------
    // 1️⃣ REQUEST NOTIFICATION
    // -----------------------------
    const pendingRequest = await this.customerRepo.findOne({
      where: {
        requestedTo: { id: userId },
        status: "Pending",
      },
    });

    if (pendingRequest) {
      items.push({
        type: "REQUEST",
        message: "You have a new connection request",
      });
    }

    // -----------------------------
    // 2️⃣ SUBSCRIPTION NOTIFICATION
    // -----------------------------
    // const now = new Date();

    // const activeSubscription = await this.subscriptionRepo.findOne({
    //   where: {
    //     tenantId,
    //     startDate: LessThanOrEqual(now),
    //     endDate: MoreThanOrEqual(now),
    //   },
    //   order: { endDate: "ASC" }, // safety if overlap exists
    // });

    // // No active subscription
    // if (!activeSubscription) {
    //   return {
    //     showNotification: true,
    //     message: "No active subscription. Please subscribe.",
    //   };
    // }

    // const endDate = activeSubscription.endDate as Date;

    // const diffInMs = endDate.getTime() - now.getTime();
    // const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

    // // Expiring soon
    // if (diffInDays <= 3) {
    //   return {
    //     showNotification: true,
    //     message: `Your current plan expires in ${diffInDays} day(s).`,
    //   };
    // }

    // return {
    //   showNotification: false,
    //   message: "",
    // };
    const now = new Date();

    const activeSubscription = await this.subscriptionRepo.findOne({
      where: {
        tenantId,
        startDate: MoreThan(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 365)), // safe range
      },
      order: { endDate: "DESC" },
    });

    if (!activeSubscription) {
      items.push({
        type: "SUBSCRIPTION",
        message: "No active subscription. Please subscribe.",
      });
    } else {
      const endDate = activeSubscription.endDate;
      const diffDays = Math.ceil(
        (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (endDate < now) {
        items.push({
          type: "SUBSCRIPTION",
          message: "Subscription expired. Please renew.",
        });
      } else if (diffDays <= 3) {
        items.push({
          type: "SUBSCRIPTION",
          message: `Subscription expires in ${diffDays} day(s).`,
        });
      }
    }

    return {
      hasNotification: items.length > 0,
      items,
    };
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

    // 2️⃣ Subscription notification (active plan only)
    const activeSubscription = await this.subscriptionRepo.findOne({
      where: {
        tenantId,
        startDate: LessThanOrEqual(now),
        endDate: MoreThan(now),
      },
      order: { endDate: "ASC" },
    });

    if (!activeSubscription) {
      items.push({
        type: "SUBSCRIPTION",
        message: "No active subscription. Please subscribe.",
      });
    } else {
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
    }

    return {
      hasNotification: items.length > 0,
      items,
    };
  }
}
