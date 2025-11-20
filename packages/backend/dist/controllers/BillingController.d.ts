import { Request, Response } from 'express';
import { BillingService } from '../services/billing/BillingService';
export declare class BillingController {
    private billingService;
    constructor(billingService: BillingService);
    createSubscription(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    handlePaymentSuccess(req: Request, res: Response): Promise<void>;
    handlePaymentFailure(req: Request, res: Response): Promise<void>;
    createProfessionalClient(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getSubscriptionStatus(req: Request, res: Response): Promise<void>;
    cancelSubscription(req: Request, res: Response): Promise<void>;
    getSubscriptionPayments(req: Request, res: Response): Promise<void>;
    handleRazorpayWebhook(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=BillingController.d.ts.map