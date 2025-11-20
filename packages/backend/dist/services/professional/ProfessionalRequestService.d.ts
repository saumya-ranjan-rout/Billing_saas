import { Customer } from "../../entities/Customer";
import { User } from "../../entities/User";
export declare class ProfessionalRequestService {
    private customerRepo;
    private tenantRepo;
    private userRepo;
    private subscriptionRepo;
    private cacheService;
    createRequest(user: any, requestedId: string, message?: string): Promise<Customer>;
    getRequests(user: any): Promise<Customer[]>;
    getProfessionals(user: User): Promise<{
        tenantId: string;
        tenantName: string;
        id: string | null;
        firstName: string | null;
        lastName: string | null;
        email: string | null;
    }[]>;
    updateStatus(customerId: string, status: string): Promise<Customer>;
}
//# sourceMappingURL=ProfessionalRequestService.d.ts.map