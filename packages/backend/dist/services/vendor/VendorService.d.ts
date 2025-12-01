import { Vendor } from '../../entities/Vendor';
import { PaginatedResponse } from '../../types/customTypes';
import { PaymentInvoice } from '../../entities/PaymentInvoice';
export declare class VendorService {
    private vendorRepository;
    private paymentRepository;
    private purchaseRepository;
    constructor();
    getVendorBalance(tenantId: string, vendorId: string): Promise<{
        vendorId: string;
        totalDue: number;
        totalPaid: number;
        balance: number;
    }>;
    recordPayment(data: any): Promise<PaymentInvoice>;
    getVendorPaymentHistory(tenantId: string, vendorId: string): Promise<{
        PaymentHistory: PaymentInvoice[];
    }>;
    createVendor(tenantId: string, vendorData: Partial<Vendor>): Promise<Vendor>;
    getVendor(tenantId: string, vendorId: string): Promise<Vendor>;
    getVendors(tenantId: string, options: {
        page: number;
        limit: number;
        name?: string;
        email?: string;
        phone?: string;
        status?: string;
        joinedFrom?: string;
        joinedTo?: string;
    }): Promise<PaginatedResponse<Vendor>>;
    updateVendor(tenantId: string, vendorId: string, updates: any): Promise<Vendor>;
    deleteVendor(tenantId: string, vendorId: string): Promise<void>;
    searchVendors(tenantId: string, query: string): Promise<Vendor[]>;
    getVendorByGSTIN(tenantId: string, gstin: string): Promise<Vendor | null>;
    updateOutstandingBalance(tenantId: string, vendorId: string, amount: number): Promise<void>;
}
//# sourceMappingURL=VendorService.d.ts.map