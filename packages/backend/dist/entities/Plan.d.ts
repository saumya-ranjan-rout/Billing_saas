import { BaseEntity } from './BaseEntity';
import { Subscription } from './Subscription';
import { PlanFeature } from './PlanFeature';
export declare enum BillingInterval {
    MONTH = "month",
    QUARTER = "quarter",
    YEAR = "year"
}
export declare class Plan extends BaseEntity {
    name: string;
    description: string;
    price_amount: number;
    price_currency: string;
    billing_interval: BillingInterval;
    trial_period_days: number;
    is_active: boolean;
    subscriptions: Subscription[];
    features: PlanFeature[];
}
//# sourceMappingURL=Plan.d.ts.map