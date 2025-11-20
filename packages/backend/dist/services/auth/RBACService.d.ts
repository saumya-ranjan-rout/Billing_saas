import { UserRole } from '../../entities/User';
export interface Permission {
    resource: string;
    action: string;
}
export declare class RBACService {
    private rolePermissions;
    constructor();
    private initializePermissions;
    hasPermission(role: UserRole, resource: string, action: string): boolean;
    getPermissionsForRole(role: UserRole): Permission[];
}
//# sourceMappingURL=RBACService.d.ts.map