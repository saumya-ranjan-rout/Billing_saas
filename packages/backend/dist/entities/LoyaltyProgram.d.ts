import { TenantAwareEntity } from './BaseEntity';
import { Tenant } from './Tenant';
export declare enum LoyaltyProgramStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    PAUSED = "paused"
}
export declare enum RewardType {
    CASHBACK = "cashback",
    POINTS = "points",
    DISCOUNT = "discount"
}
export declare class LoyaltyProgram extends TenantAwareEntity {
    name: string;
    description: string;
    status: LoyaltyProgramStatus;
    rewardType: RewardType;
    cashbackPercentage: number;
    minimumPurchaseAmount: number;
    maximumCashbackAmount: number;
    pointsPerUnit: number;
    pointValue: number;
    eligibilityCriteria: {
        customerGroups?: string[];
        productCategories?: string[];
        minimumOrderValue?: number;
        excludedProducts?: string[];
    };
    redemptionRules: {
        minimumPoints?: number;
        maximumRedemptionPerOrder?: number;
        validityPeriod?: number;
    };
    isDefault: boolean;
    tenant: Tenant;
}
//# sourceMappingURL=LoyaltyProgram.d.ts.map