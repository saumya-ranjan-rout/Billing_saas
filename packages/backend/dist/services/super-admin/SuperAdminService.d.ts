import { SuperAdmin } from '../../entities/SuperAdmin';
import { AuditAction, AuditResource } from '../../entities/AuditLog';
import { User, UserRole, UserStatus } from '../../entities/User';
import { Tenant } from '../../entities/Tenant';
import { ProfessionalUser } from '../../entities/ProfessionalUser';
interface FilterOptions {
    page?: number;
    limit?: number;
    search?: string;
    startDate?: Date;
    endDate?: Date;
    status?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    professionalType?: string;
}
export declare class SuperAdminService {
    private superAdminRepository;
    private auditLogRepository;
    private userRepository;
    private tenantRepository;
    private professionalRepository;
    private subscriptionRepository;
    private cacheService;
    constructor();
    createSuperAdmin(superAdminData: any): Promise<SuperAdmin>;
    getDashboardStats(): Promise<any>;
    getUsersWithFilters(filters: FilterOptions): Promise<any>;
    createUser(data: {
        firstName: string;
        lastName: string;
        email: string;
        role: UserRole;
        status: UserStatus;
        password: string;
        tenantId: string;
    }): Promise<User>;
    updateUser(id: string, data: Partial<{
        firstName: string;
        lastName: string;
        email: string;
        role: UserRole;
        status: UserStatus;
        tenantId: string;
    }>): Promise<User>;
    createTenant(data: Partial<Tenant>): Promise<Tenant>;
    updateTenant(id: string, data: Partial<Tenant>): Promise<Tenant>;
    getUserById(id: string): Promise<User | null>;
    getTenantsWithFilters(filters: FilterOptions): Promise<any>;
    getSubscriptions(): Promise<any>;
    createProfessional(data: any): Promise<ProfessionalUser>;
    updateProfessional(id: string, data: any): Promise<ProfessionalUser>;
    getProfessionalsWithFilters(filters: FilterOptions): Promise<any>;
    updateProfessionalStatus(id: string, userId: string, isActive: boolean): Promise<void>;
    getAuditLogs(filters: FilterOptions & {
        action?: AuditAction;
        resource?: AuditResource;
        performedById?: string;
    }): Promise<any>;
    createAuditLog(performedById: string, action: AuditAction, resource: AuditResource, resourceId: string, details: any, ipAddress?: string, userAgent?: string): Promise<void>;
    private getRevenueData;
    private getSystemHealth;
    private checkDatabaseHealth;
    private checkStorageHealth;
    private checkAPIHealth;
    exportData(resource: 'users' | 'tenants' | 'professionals' | 'auditLogs', format: 'csv' | 'json', filters: any): Promise<string>;
    private convertToCSV;
    updateUserStatus(id: string, isActive: boolean): Promise<void>;
    updateTenantStatus(id: string, isActive: boolean): Promise<void>;
}
export {};
//# sourceMappingURL=SuperAdminService.d.ts.map