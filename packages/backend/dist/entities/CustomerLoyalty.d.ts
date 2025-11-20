import { TenantAwareEntity } from './BaseEntity';
import { Customer } from './Customer';
import { LoyaltyProgram } from './LoyaltyProgram';
export declare enum LoyaltyTier {
    BRONZE = "bronze",
    SILVER = "silver",
    GOLD = "gold",
    PLATINUM = "platinum"
}
export declare class CustomerLoyalty extends TenantAwareEntity {
    customerId: string;
    customer: Customer;
    programId: string;
    program: LoyaltyProgram;
    totalPoints: number;
    availablePoints: number;
    totalCashbackEarned: number;
    availableCashback: number;
    totalAmountSpent: number;
    totalOrders: number;
    currentTier: LoyaltyTier;
    tierExpiryDate: Date;
    tierBenefits: Record<string, any>;
    lastActivityDate: Date;
    statistics: {
        averageOrderValue: number;
        lastOrderAmount: number;
        redemptionRate: number;
    };
}
//# sourceMappingURL=CustomerLoyalty.d.ts.map