import { User } from './User';
import { Tenant } from './Tenant';
import { BaseEntity } from './BaseEntity';
export declare enum ProfessionalType {
    CA = "ca",
    ACCOUNTANT = "accountant",
    CONSULTANT = "consultant",
    OTHER = "other"
}
export declare class ProfessionalUser extends BaseEntity {
    userId: string;
    id: string;
    user: User;
    professionalType: ProfessionalType;
    firmName?: string;
    professionalLicenseNumber?: string;
    phone?: string;
    address?: string;
    isActive: boolean;
    managedTenants: Tenant[];
    permissions: any;
}
//# sourceMappingURL=ProfessionalUser.d.ts.map