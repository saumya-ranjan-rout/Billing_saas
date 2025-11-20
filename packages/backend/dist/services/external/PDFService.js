"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PDFService = void 0;
class PDFService {
    async generateInvoicePDF(invoice) {
        return Buffer.from(`PDF for invoice ${invoice.id || ''}`);
    }
}
exports.PDFService = PDFService;
//# sourceMappingURL=PDFService.js.map