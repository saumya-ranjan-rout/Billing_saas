/// <reference types="node" />
/// <reference types="node" />
export declare class GSTR1Service {
    private invoiceRepository;
    private gstCalculationService;
    generateGSTR1Report(tenantId: string, period: string): Promise<any>;
    generateGSTR1JSON(tenantId: string, period: string): Promise<string>;
    generateGSTR1Excel(tenantId: string, period: string): Promise<Buffer>;
}
//# sourceMappingURL=GSTR1Service.d.ts.map