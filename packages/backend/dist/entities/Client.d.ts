import { Tenant } from './Tenant';
export declare class Client {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    taxId?: string;
    tenantId: string;
    tenant: Tenant;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=Client.d.ts.map