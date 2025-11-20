import { Payment } from '../../entities/Payment';
export declare class RazorpayService {
    private razorpay;
    constructor();
    createOrder(payment: Payment): Promise<{
        id: string;
        amount: number;
        currency: string;
        receipt: string;
        status: string;
    }>;
    verifyPaymentSignature(orderId: string, paymentId: string, signature: string): Promise<boolean>;
    capturePayment(paymentId: string, amount: number): Promise<any>;
    createSubscription(planId: string, totalCount?: number): Promise<any>;
}
//# sourceMappingURL=RazorpayService.d.ts.map