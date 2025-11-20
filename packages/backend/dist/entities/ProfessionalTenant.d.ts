import { ProfessionalUser } from './ProfessionalUser';
import { Tenant } from './Tenant';
export declare class ProfessionalTenant {
    id: string;
    professional: ProfessionalUser;
    professionalId: string;
    tenant: Tenant;
    tenantId: string;
    specificPermissions: {
        canFileGST: boolean;
        canManagePurchases: boolean;
        canApproveExpenses: boolean;
    };
    isActive: boolean;
    assignedAt: Date;
}
//# sourceMappingURL=ProfessionalTenant.d.ts.map