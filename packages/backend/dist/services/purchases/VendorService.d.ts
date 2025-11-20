import { Vendor } from '../../entities/Vendor';
export declare class VendorService {
    private vendorRepository;
    constructor();
    createVendor(tenantId: string, vendorData: any): Promise<Vendor>;
    getVendor(tenantId: string, vendorId: string): Promise<Vendor>;
    getVendors(tenantId: string, options: {
        page: number;
        limit: number;
        search?: string;
        isActive?: boolean;
    }): Promise<any>;
    updateVendor(tenantId: string, vendorId: string, updateData: any): Promise<Vendor>;
    deleteVendor(tenantId: string, vendorId: string): Promise<void>;
}
//# sourceMappingURL=VendorService.d.ts.map