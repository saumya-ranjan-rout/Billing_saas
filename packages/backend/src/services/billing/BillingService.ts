// src/services/billing/BillingService.ts
import { AppDataSource } from "../../config/database";
import { SubscriptionPlan, PlanType } from "../../entities/SubscriptionPlan";
import { Subscription, SubscriptionStatus } from "../../entities/Subscription";
import { Payment, PaymentStatus, PaymentGateway } from "../../entities/Payment";
import { Tenant } from "../../entities/Tenant";
import { RazorpayService } from "./RazorpayService";
import logger from "../../utils/logger";

export class BillingService {
  private subscriptionRepo = AppDataSource.getRepository(Subscription);
  private paymentRepo = AppDataSource.getRepository(Payment);
  private planRepo = AppDataSource.getRepository(SubscriptionPlan);
  private tenantRepo = AppDataSource.getRepository(Tenant);

  private razorpayService = new RazorpayService();

  /**
   * Create Subscription for Admin or Professional User
   *
   * NOTE: Subscription entity does not have `amount` or `planType` columns in your schema.
   * We store price on the Payment and reference the plan by planId.
   */
  async createSubscription(
    planType: PlanType,
    entityId: string, // this will be used as userId/tenant id depending on your flow
    paymentMethod: string
  ) {
    // plan entity uses `type` and `price`
    const plan = await this.planRepo.findOne({ where: { type: planType } });

    if (!plan) {
      throw new Error("Invalid plan type");
    }

    // Create subscription record — reference the plan by planId
    const subscription = this.subscriptionRepo.create({
      // assign userId to whoever initiated the subscription (adapt if you need tenantId instead)
      userId: entityId,
      planId: plan.id,
      startDate: new Date(),
      // keep endDate null until activated
      endDate: null as any,
      status: SubscriptionStatus.PENDING,
      autoRenew: false,
      metadata: { createdBy: "billing-service" },
    });

    const savedSubscription = await this.subscriptionRepo.save(subscription);

    // Create Razorpay order (amount comes from plan.price)
    const order = await this.razorpayService.createOrder(Number(plan.price));

    // Create payment record. Use enums defined on Payment entity.
    const payment = this.paymentRepo.create({
      userId: entityId,
      subscriptionId: savedSubscription.id,
      amount: Number(plan.price),
      currency: plan.currency || "INR",
      gateway: PaymentGateway.RAZORPAY,
      gatewayOrderId: order.id,
      status: PaymentStatus.PENDING,
      gatewayResponse: order,
      description: `Subscription payment for ${plan.name}`,
    } as Partial<Payment>);

    const savedPayment = await this.paymentRepo.save(payment);

    return { subscription: savedSubscription, payment: savedPayment };
  }

  /**
   * Handle successful Razorpay payment
   */
  async handlePaymentSuccess(
    paymentId: string,
    razorpayPaymentId: string,
    razorpayResponse: any
  ) {
    const payment = await this.paymentRepo.findOne({
      where: { id: paymentId },
      relations: ["subscription"],
    });

    if (!payment) {
      throw new Error("Payment not found");
    }

    payment.status = PaymentStatus.COMPLETED;
    // your Payment entity has gatewayPaymentId and gatewayOrderId fields.
    // there is also a legacy razorpayPaymentId column — use whichever you prefer.
    payment.gatewayPaymentId = razorpayPaymentId;
    payment.gatewayResponse = razorpayResponse;
    payment.paidAt = new Date();

    await this.paymentRepo.save(payment);

    // Activate subscription
    if (payment.subscription) {
      payment.subscription.status = SubscriptionStatus.ACTIVE;
      payment.subscription.startDate = new Date();
      payment.subscription.endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

      await this.subscriptionRepo.save(payment.subscription);
    }

    return payment;
  }

  /**
   * Handle failed Razorpay payment
   */
  async handlePaymentFailure(paymentId: string, razorpayResponse: any) {
    const payment = await this.paymentRepo.findOne({
      where: { id: paymentId },
      relations: ["subscription"],
    });

    if (!payment) {
      throw new Error("Payment not found");
    }

    payment.status = PaymentStatus.FAILED;
    payment.gatewayResponse = razorpayResponse;

    await this.paymentRepo.save(payment);

    if (payment.subscription) {
      payment.subscription.status = SubscriptionStatus.CANCELLED;
      await this.subscriptionRepo.save(payment.subscription);
    }

    return payment;
  }

  /**
   * Create tenant + subscription for Professional User
   */
  async createProfessionalClientSubscription(
    professionalId: string,
    tenantData: any,
    paymentMethod: string
  ) {
    // Create tenant entity and persist
const tenantEntity: Tenant = this.tenantRepo.create({
  name: tenantData.name,
  businessName: tenantData.businessName,
  subdomain: tenantData.subdomain,
  slug: tenantData.slug,
  status: tenantData.status,
  accountType: tenantData.accountType,
  professionType: tenantData.professionType,
  licenseNo: tenantData.licenseNo,
  pan: tenantData.pan,
  gst: tenantData.gst,
 professionals: [{ id: professionalId }],
});

const savedTenant = await this.tenantRepo.save(tenantEntity);

const { subscription, payment } = await this.createSubscription(
  PlanType.BASIC,
  savedTenant.id,
  paymentMethod
);

return { tenant: savedTenant, subscription, payment };

  }

  /**
   * Check subscription status for an entity (tenant/user) and a plan type
   */
  async checkSubscriptionStatus(entityId: string, planType: PlanType) {
    // We query subscription where its tenant.id == entityId (or userId == entityId depending on your model)
    // and subscription.plan.type == planType
    const subscription = await this.subscriptionRepo.findOne({
      where: {
        tenant: { id: entityId },
        plan: { type: planType },
      } as any,
      relations: ["tenant", "plan"],
      order: { createdAt: "DESC" } as any,
    });

    if (!subscription) {
      return { status: "none", active: false };
    }

    return {
      status: subscription.status,
      active: subscription.status === SubscriptionStatus.ACTIVE,
      subscription,
    };
  }

  /**
   * Cancel a subscription
   */
  async cancelSubscription(subscriptionId: string) {
    const subscription = await this.subscriptionRepo.findOne({
      where: { id: subscriptionId },
    });

    if (!subscription) {
      throw new Error("Subscription not found");
    }

    subscription.status = SubscriptionStatus.CANCELLED;
    subscription.endDate = new Date();

    return await this.subscriptionRepo.save(subscription);
  }

  /**
   * Fetch payments of a subscription
   */
  async getSubscriptionPayments(subscriptionId: string) {
    return this.paymentRepo.find({
      where: { subscription: { id: subscriptionId } } as any,
      order: { createdAt: "DESC" },
    });
  }
}
