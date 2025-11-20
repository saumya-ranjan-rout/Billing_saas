import { Request, Response } from 'express';
export declare class SubscriptionController {
    private subscriptionService;
    private razorpayService;
    constructor();
    getPlans(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    createSubscription(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    handlePaymentSuccess(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getCurrentSubscription(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    cancelSubscription(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getStats(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    checkAccess(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    handlePaymentFailure(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=SubscriptionController.d.ts.map