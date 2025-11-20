import { User } from './User';
export declare class SuperAdmin {
    id: string;
    userId: string;
    first_name: string;
    last_name: string;
    email: string;
    password_hash: string;
    is_active: boolean;
    permissions: {
        canManageUsers: boolean;
        canManageTenants: boolean;
        canManageProfessionals: boolean;
        canViewAnalytics: boolean;
        canManageSystemSettings: boolean;
        canAccessAuditLogs: boolean;
    };
    createdAt: Date;
    updatedAt: Date;
    user: User;
}
//# sourceMappingURL=SuperAdmin.d.ts.map