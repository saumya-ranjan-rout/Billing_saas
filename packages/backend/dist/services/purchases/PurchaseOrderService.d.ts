import { PurchaseOrder, PurchaseOrderStatus } from '../../entities/PurchaseOrder';
export declare class PurchaseOrderService {
    private poRepository;
    private poItemRepository;
    private vendorService;
    constructor();
    createPurchaseOrder(tenantId: string, poData: any): Promise<PurchaseOrder>;
    getPurchaseOrder(tenantId: string, poId: string): Promise<PurchaseOrder>;
    getPurchaseOrders(tenantId: string, options: {
        page: number;
        limit: number;
        status?: PurchaseOrderStatus;
        vendorId?: string;
        startDate?: Date;
        endDate?: Date;
    }): Promise<any>;
    updatePurchaseOrderStatus(tenantId: string, poId: string, status: PurchaseOrderStatus): Promise<PurchaseOrder>;
    deletePurchaseOrder(tenantId: string, poId: string): Promise<void>;
    private calculatePOTotals;
    private generatePONumber;
}
//# sourceMappingURL=PurchaseOrderService.d.ts.map