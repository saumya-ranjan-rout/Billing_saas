import { PurchaseOrder, PurchaseOrderStatus } from '../../entities/PurchaseOrder';
import { PaginatedResponse } from '../../types/customTypes';
export declare class PurchaseService {
    private purchaseOrderRepository;
    private purchaseItemRepository;
    private vendorRepository;
    private productRepository;
    constructor();
    private generatePONumber;
    private calculateItemTotals;
    createPurchaseOrder(tenantId: string, purchaseData: any): Promise<PurchaseOrder>;
    getPurchaseOrder(tenantId: string, poId: string): Promise<PurchaseOrder>;
    getPurchaseOrders(tenantId: string, options: {
        page: number;
        limit: number;
        search?: string;
        status?: PurchaseOrderStatus;
        vendorId?: string;
    }): Promise<PaginatedResponse<PurchaseOrder>>;
    updatePurchaseOrder(tenantId: string, poId: string, updates: any): Promise<PurchaseOrder>;
    updatePurchaseOrderStatus(tenantId: string, poId: string, status: PurchaseOrderStatus): Promise<PurchaseOrder>;
    deletePurchaseOrder(tenantId: string, poId: string): Promise<void>;
    getVendorPurchaseOrders(tenantId: string, vendorId: string): Promise<PurchaseOrder[]>;
    getPurchaseOrderSummary(tenantId: string): Promise<any>;
}
//# sourceMappingURL=PurchaseService.d.ts.map