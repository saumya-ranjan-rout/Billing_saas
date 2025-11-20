import { Invoice } from "../../entities/Invoice";
export interface EInvoiceResponse {
    irn: string;
    ackNo: string;
    ackDate: Date;
    signedQRCode: string;
}
export declare class EInvoiceService {
    private apiBaseUrl;
    private authToken;
    constructor();
    generateIRN(invoice: Invoice): Promise<EInvoiceResponse>;
    cancelIRN(irn: string, reason: string, reasonCode: string): Promise<void>;
    private prepareEInvoicePayload;
    private formatDate;
}
//# sourceMappingURL=EInvoiceService.d.ts.map