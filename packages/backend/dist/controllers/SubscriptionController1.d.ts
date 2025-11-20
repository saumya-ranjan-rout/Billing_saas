import { Request, Response } from 'express';
import { SubscriptionService } from '../services/billing/SubscriptionService';
export declare class SubscriptionController {
    private subscriptionService;
    constructor(subscriptionService: SubscriptionService);
    createSubscription(req: Request, res: Response): Promise<void>;
    cancelSubscription(req: Request, res: Response): Promise<void>;
    getSubscription(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=SubscriptionController1.d.ts.map