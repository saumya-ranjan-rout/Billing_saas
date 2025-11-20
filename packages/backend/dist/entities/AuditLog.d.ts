import { SuperAdmin } from './SuperAdmin';
export declare enum AuditAction {
    CREATE = "create",
    UPDATE = "update",
    DELETE = "delete",
    LOGIN = "login",
    LOGOUT = "logout",
    EXPORT = "export"
}
export declare enum AuditResource {
    USER = "user",
    TENANT = "tenant",
    PROFESSIONAL = "professional",
    SUBSCRIPTION = "subscription",
    SYSTEM = "system"
}
export declare class AuditLog {
    id: string;
    performedBy: SuperAdmin;
    tenantId: string;
    performedById: string;
    action: AuditAction;
    resource: AuditResource;
    resourceId: string;
    details: any;
    ipAddress: string;
    userAgent: string;
    timestamp: Date;
}
//# sourceMappingURL=AuditLog.d.ts.map