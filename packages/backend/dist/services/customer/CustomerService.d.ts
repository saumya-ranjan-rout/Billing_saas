import { Customer } from '../../entities/Customer';
import { User } from '../../entities/User';
import { PaginatedResponse } from '../../types/customTypes';
export interface AuthPayload {
    userId: string;
    tenantId: string;
    email: string;
    role: string;
    permissions: string[];
    firstName: string;
    lastName: string;
}
export declare class CustomerService {
    private customerRepository;
    private subscriptionRepository;
    private userRepository;
    private refreshTokens;
    constructor();
    createCustomer(tenantId: string, customerData: Partial<Customer>): Promise<Customer>;
    getCustomer(tenantId: string, customerId: string): Promise<Customer>;
    getCustomers(tenantId: string, options: {
        page: number;
        limit: number;
        search?: string;
    }): Promise<PaginatedResponse<Customer>>;
    updateCustomer(tenantId: string, customerId: string, updates: any): Promise<Customer>;
    deleteCustomer(tenantId: string, customerId: string): Promise<void>;
    searchCustomers(tenantId: string, query: string): Promise<Customer[]>;
    getCustomerByGSTIN(tenantId: string, gstin: string): Promise<Customer | null>;
    getCustomersWithInvoices(tenantId: string, options: {
        page: number;
        limit: number;
        search?: string;
    }): Promise<{
        data: Customer[];
        total: number;
        page: number;
        limit: number;
    }>;
    updateUser(tenantId: string, loggedtenantId: string, loggedId: string): Promise<User>;
    switchTenant(payload: AuthPayload): Promise<{
        user: AuthPayload;
        accessToken: string;
        refreshToken: string;
    }>;
    private generateToken;
    private generateRefreshToken;
}
//# sourceMappingURL=CustomerService.d.ts.map