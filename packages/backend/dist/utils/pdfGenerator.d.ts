/// <reference types="node" />
/// <reference types="node" />
import { Invoice, Customer } from '../types/customTypes';
export declare class PDFGenerator {
    static generateInvoicePDF(invoice: Invoice, customer: Customer): Promise<Buffer>;
    private static addHeader;
    private static addCustomerInfo;
    private static addInvoiceDetails;
    private static addItemsTable;
    private static addTotals;
    private static addFooter;
}
//# sourceMappingURL=pdfGenerator.d.ts.map