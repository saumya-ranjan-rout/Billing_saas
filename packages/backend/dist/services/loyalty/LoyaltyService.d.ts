import { LoyaltyProgram } from '../../entities/LoyaltyProgram';
import { CustomerLoyalty } from '../../entities/CustomerLoyalty';
import { LoyaltyTransaction } from '../../entities/LoyaltyTransaction';
export declare class LoyaltyService {
    private programRepository;
    private customerLoyaltyRepository;
    private transactionRepository;
    private customerRepository;
    private invoiceRepository;
    constructor();
    private safeNumber;
    private roundToTwoDecimals;
    private safeAdd;
    initializeDefaultProgram(tenantId: string): Promise<LoyaltyProgram>;
    calculateCashback(tenantId: string, customerId: string, invoiceAmount: any): Promise<{
        cashbackAmount: number;
        percentage: number;
    }>;
    processInvoiceForLoyalty(invoiceId: string): Promise<void>;
    updateCustomerTier(customerLoyalty: CustomerLoyalty): Promise<void>;
    redeemCashback(tenantId: string, customerId: string, redeemAmount: number, invoiceId?: string): Promise<LoyaltyTransaction>;
    getCustomerLoyaltySummary(tenantId: string, customerId: string): Promise<any>;
    updateLoyaltyProgram(tenantId: string, programId: string, updates: Partial<LoyaltyProgram>): Promise<LoyaltyProgram>;
    getProgramStatistics(tenantId: string, programId: string): Promise<any>;
    getActiveProgram(tenantId: string): Promise<LoyaltyProgram>;
}
//# sourceMappingURL=LoyaltyService.d.ts.map