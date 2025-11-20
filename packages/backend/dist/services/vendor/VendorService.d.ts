import { Vendor } from '../../entities/Vendor';
import { PaginatedResponse } from '../../types/customTypes';
export declare class VendorService {
    private vendorRepository;
    constructor();
    createVendor(tenantId: string, vendorData: Partial<Vendor>): Promise<Vendor>;
    getVendor(tenantId: string, vendorId: string): Promise<Vendor>;
    getVendors(tenantId: string, options: {
        page: number;
        limit: number;
        search?: string;
    }): Promise<PaginatedResponse<Vendor>>;
    updateVendor(tenantId: string, vendorId: string, updates: any): Promise<Vendor>;
    deleteVendor(tenantId: string, vendorId: string): Promise<void>;
    searchVendors(tenantId: string, query: string): Promise<Vendor[]>;
    getVendorByGSTIN(tenantId: string, gstin: string): Promise<Vendor | null>;
    updateOutstandingBalance(tenantId: string, vendorId: string, amount: number): Promise<void>;
}
//# sourceMappingURL=VendorService.d.ts.map