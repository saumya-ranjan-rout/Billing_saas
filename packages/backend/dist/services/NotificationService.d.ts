export declare class NotificationService {
    private subscriptionRepo;
    private customerRepo;
    private emailService;
    constructor();
    getNotificationStatus(userId: string, tenantId: string): Promise<{
        hasNotification: boolean;
        items: {
            type: string;
            message: string;
        }[];
    }>;
}
//# sourceMappingURL=NotificationService.d.ts.map