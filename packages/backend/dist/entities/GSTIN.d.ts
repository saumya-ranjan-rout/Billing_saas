import { Tenant } from './Tenant';
import { Invoice } from './Invoice';
export declare class GSTIN {
    id: number;
    gstin: string;
    legalName: string;
    tradeName: string;
    address: {
        line1: string;
        line2?: string;
        city: string;
        state: string;
        country: string;
        pincode: string;
    };
    stateCode: string;
    isActive: boolean;
    isPrimary: boolean;
    authStatus?: {
        status: 'verified' | 'pending' | 'failed';
        verifiedAt?: Date;
    };
    tenantId: string;
    tenant: Tenant;
    invoices: Invoice[];
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=GSTIN.d.ts.map