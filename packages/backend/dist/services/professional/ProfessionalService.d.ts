import { ProfessionalUser } from '../../entities/ProfessionalUser';
import { ProfessionalTenant } from '../../entities/ProfessionalTenant';
import { Tenant } from '../../entities/Tenant';
import { User } from '../../entities/User';
export declare class ProfessionalService {
    private professionalRepository;
    private professionalTenantRepository;
    private tenantRepository;
    private userRepository;
    constructor();
    registerProfessional(userData: Partial<User>, professionalData: Partial<ProfessionalUser>): Promise<ProfessionalUser>;
    assignProfessionalToTenant(professionalId: string, tenantId: string, permissions?: any): Promise<ProfessionalTenant>;
    getProfessionalTenants(professionalId: string): Promise<Tenant[]>;
    getTenantProfessionals(tenantId: string): Promise<ProfessionalUser[]>;
    updateProfessionalPermissions(professionalId: string, tenantId: string, permissions: any): Promise<ProfessionalTenant>;
    getProfessionalDashboard(professionalId: string): Promise<{
        tenants: Tenant[];
        complianceData: any[];
        recentActivities: any[];
        financialSummary: any;
    }>;
    private getUpcomingComplianceDates;
    private getRecentActivities;
    private getFinancialSummary;
}
//# sourceMappingURL=ProfessionalService.d.ts.map