import { User } from './User';
export declare class Notification {
    id: string;
    title: string;
    body: string;
    data: Record<string, any>;
    isRead: boolean;
    type: string | null;
    priority: string;
    userId: string | null;
    user: User;
    createdAt: Date;
}
//# sourceMappingURL=Notification.d.ts.map