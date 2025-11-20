import { User } from "../../entities/User";
import { Tenant } from "../../entities/Tenant";
import { BaseService } from "../BaseService";
export interface AuthPayload {
    userId: string;
    tenantId: string;
    email: string;
    role: string;
    permissions: string[];
    firstName: string;
    lastName: string;
}
export declare class AuthService extends BaseService<User> {
    private emailService;
    private tenantRepository;
    private subscriptionRepository;
    private refreshTokens;
    constructor();
    registerWithTenant(data: {
        businessName?: string;
        subdomain?: string;
        slug?: string;
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        accountType?: string;
        professionType?: string;
        licenseNo?: string;
        pan?: string;
        gst?: string;
    }): Promise<User>;
    register(userData: Partial<User>, tenantId: string): Promise<User>;
    switchTenant(updatedPayload: AuthPayload): Promise<{
        user: User;
        accessToken: string;
        refreshToken: string;
    }>;
    login(email: string, password: string): Promise<{
        user: User;
        accessToken: string;
        refreshToken: string;
        check_subscription: boolean;
    }>;
    superUserlogin(tenantId: string, email: string, password: string): Promise<{
        user: User;
        accessToken: string;
        refreshToken: string;
    }>;
    refreshToken(refreshToken: string): Promise<{
        accessToken: string;
    }>;
    logout(refreshToken: string): Promise<void>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void>;
    resetPassword(email: string, tenantId: string): Promise<void>;
    confirmResetPassword(token: string, newPassword: string): Promise<void>;
    private generateToken;
    private generateRefreshToken;
    verifyToken(token: string): AuthPayload;
    enableBiometric(userId: string): Promise<void>;
    getTenantsForUser(email: string): Promise<Tenant[]>;
    getTenants(): Promise<Tenant[]>;
}
export declare const hashPassword: (plain: string) => Promise<string>;
//# sourceMappingURL=AuthService.d.ts.map