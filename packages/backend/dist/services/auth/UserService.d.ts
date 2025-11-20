import { User, UserRole } from '../../entities/User';
import { TenantAwareService } from '../BaseService';
export declare class UserService extends TenantAwareService<User> {
    constructor();
    createUser(data: Partial<User>): Promise<User>;
    updateUserRole(userId: string, tenantId: string, role: UserRole): Promise<User>;
    deactivateUser(userId: string, tenantId: string): Promise<User>;
    activateUser(userId: string, tenantId: string): Promise<User>;
    findAllByTenant(tenantId: string, options?: any): Promise<User[]>;
    deactivateAllUsers(tenantId: string): Promise<void>;
}
//# sourceMappingURL=UserService.d.ts.map