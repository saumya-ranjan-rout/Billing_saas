import { User } from "../../entities/User";
import { PaginatedResponse } from "../../types/customTypes";
export declare class UserService {
    private userRepository;
    constructor();
    createUser(tenantId: string, userData: Partial<User>): Promise<User>;
    getUser(tenantId: string, userId: string): Promise<User>;
    getUsers(tenantId: string, options: {
        page: number;
        limit: number;
        search?: string;
    }): Promise<PaginatedResponse<User>>;
    updateUser(tenantId: string, userId: string, updates: Partial<User>): Promise<User>;
    deleteUser(tenantId: string, userId: string): Promise<void>;
    resetPassword(tenantId: string, userId: string, newPassword: string): Promise<User>;
}
//# sourceMappingURL=UserService.d.ts.map