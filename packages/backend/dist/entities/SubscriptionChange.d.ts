import { BaseEntity } from './BaseEntity';
import { Plan } from './Plan';
import { User } from './User';
export declare enum ChangeType {
    UPGRADE = "upgrade",
    DOWNGRADE = "downgrade",
    SWITCH = "switch"
}
export declare enum ChangeStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
    COMPLETED = "completed"
}
export declare class SubscriptionChange extends BaseEntity {
    subscriptionId: string;
    plan: Plan;
    requested_plan_id: string;
    change_type: ChangeType;
    status: ChangeStatus;
    scheduled_at: Date;
    effective_date: Date;
    prorated_amount: number | null;
    notes: string;
    requested_by: User;
    requested_by_user_id: string;
    reviewed_by: User;
    reviewed_by_user_id: string;
    reviewed_at: Date;
}
//# sourceMappingURL=SubscriptionChange.d.ts.map