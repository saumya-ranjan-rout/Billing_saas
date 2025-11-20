export declare class GSTFilingService {
    private professionalRepository;
    private tenantRepository;
    constructor();
    prepareGSTR1(professionalId: string, tenantId: string, period: string): Promise<any>;
    prepareGSTR3B(professionalId: string, tenantId: string, period: string): Promise<any>;
    fileGSTRETurn(professionalId: string, tenantId: string, returnType: string, period: string, returnData: any): Promise<{
        success: boolean;
        acknowledgmentNumber: string;
    }>;
    getFilingHistory(professionalId: string, tenantId?: string): Promise<any[]>;
    private verifyProfessionalAccess;
    private generateGSTR1Data;
    private generateGSTR3BData;
    private submitToGSTPortal;
    private saveFilingRecord;
    private validateReturnData;
    private getPeriodStart;
    private getPeriodEnd;
    private transformToGSTR1;
    private getB2BInvoices;
    private getB2CLInvoices;
}
//# sourceMappingURL=GSTFilingService.d.ts.map