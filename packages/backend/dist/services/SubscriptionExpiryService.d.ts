export declare class SubscriptionExpiryService {
    private subRepo;
    private emailService;
    run(): Promise<{
        processed: number;
        sent: number;
    }>;
    private processSubscription;
}
//# sourceMappingURL=SubscriptionExpiryService.d.ts.map