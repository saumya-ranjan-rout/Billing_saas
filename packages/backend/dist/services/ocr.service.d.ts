export declare class OCRService {
    private worker;
    constructor();
    private initializeWorker;
    processReceipt(imageBase64: string): Promise<{
        text: any;
        extractedData: {
            totalAmount: number | null;
            date: string | null;
            vendor: string | null;
        };
    }>;
    processInvoice(imageBase64: string): Promise<{
        extractedData: {
            invoiceNumber: string | null;
            totalAmount: number | null;
            date: string | null;
            vendor: string | null;
        };
        text: any;
    }>;
    private extractTotalAmount;
    private extractDate;
    private extractVendor;
    private extractInvoiceNumber;
}
//# sourceMappingURL=ocr.service.d.ts.map