/// <reference types="node" />
/// <reference types="node" />
import Stripe from 'stripe';
import { SubscriptionPlan } from '../../types/billing/StripeTypes';
export declare class StripeService {
    private stripe;
    constructor();
    createCustomer(data: {
        email?: string;
        name?: string;
        metadata: Record<string, string>;
    }): Promise<Stripe.Customer>;
    createSubscription(customerId: string, plan: SubscriptionPlan, paymentMethodId: string): Promise<Stripe.Subscription>;
    createPaymentIntent(data: {
        amount: number;
        currency: string;
        customerId: string;
        metadata: Record<string, string>;
    }): Promise<Stripe.PaymentIntent>;
    constructEvent(payload: Buffer, signature: string, secret: string): Promise<Stripe.Event>;
    handleWebhookEvent(event: Stripe.Event): Promise<void>;
    private handlePaymentIntentSucceeded;
    private handleInvoicePaymentFailed;
    private handleSubscriptionDeleted;
    cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription>;
    updateSubscription(subscriptionId: string, newPlan: SubscriptionPlan): Promise<Stripe.Subscription>;
    private getStripeProductId;
}
//# sourceMappingURL=StripeService.d.ts.map