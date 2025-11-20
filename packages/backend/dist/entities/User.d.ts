import { Tenant } from './Tenant';
import { Notification } from './Notification';
import { SyncLog } from './SyncLog';
import { TenantAwareEntity } from './BaseEntity';
import { Role } from './Role';
import { ProfessionalUser } from './ProfessionalUser';
export declare enum UserRole {
    SUPER_ADMIN = "super_admin",
    ADMIN = "admin",
    FINANCE = "finance",
    SALES = "sales",
    SUPPORT = "support",
    MEMBER = "member",
    USER = "user",
    PROFESSIONAL = "professional",
    SUPER_USER = "super_user",
    PROFESSIONAL_USER = "professional_user"
}
export declare enum UserStatus {
    ACTIVE = "active",
    INVITED = "invited",
    SUSPENDED = "suspended"
}
export declare class User extends TenantAwareEntity {
    id: string;
    email: string;
    password: string;
    status: UserStatus;
    firstName: string;
    lastName: string;
    pushToken: string | null;
    role: UserRole;
    biometricEnabled: boolean;
    tenantId: string;
    backupTenantId: string;
    lastLoginAt?: Date;
    tenant: Tenant;
    notifications: Notification[];
    syncLogs: SyncLog[];
    createdAt: Date;
    updatedAt: Date;
    roles: Role[];
    professionals: ProfessionalUser[];
    hashPassword(): Promise<void>;
    validatePassword(password: string): Promise<boolean>;
}
//# sourceMappingURL=User.d.ts.map