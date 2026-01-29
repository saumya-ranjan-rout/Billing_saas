"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PDFGenerator = void 0;
const pdfkit_1 = __importDefault(require("pdfkit"));
const helpers_1 = require("./helpers");
class PDFGenerator {
    static async generateInvoicePDF(invoice, customer) {
        return new Promise((resolve, reject) => {
            try {
                const doc = new pdfkit_1.default({ margin: 50 });
                const buffers = [];
                doc.on('data', (chunk) => buffers.push(chunk));
                doc.on('end', () => resolve(Buffer.concat(buffers)));
                this.addHeader(doc, invoice);
                this.addCustomerInfo(doc, customer);
                this.addInvoiceDetails(doc, invoice);
                this.addItemsTable(doc, invoice);
                this.addTotals(doc, invoice);
                this.addFooter(doc);
                doc.end();
            }
            catch (err) {
                reject(err);
            }
        });
    }
    static addHeader(doc, invoice) {
        doc
            .fontSize(20)
            .text('INVOICE', 50, 50)
            .fontSize(10)
            .text(`Invoice #: ${invoice.invoiceNumber}`, 50, 80)
            .text(`Issue Date: ${(0, helpers_1.formatDate)(invoice.issueDate)}`, 50, 95)
            .text(`Due Date: ${(0, helpers_1.formatDate)(invoice.dueDate)}`, 50, 110);
    }
    static addCustomerInfo(doc, customer) {
        doc
            .fontSize(12)
            .text('Bill To:', 350, 80)
            .fontSize(10)
            .text(customer.name, 350, 95)
            .text(customer.email, 350, 110);
    }
    static addInvoiceDetails(doc, invoice) {
        doc
            .fontSize(10)
            .text(`Status: ${invoice.status.toUpperCase()}`, 50, 140)
            .text(`Payment Terms: ${invoice.paymentTerms} days`, 50, 155);
    }
    static addItemsTable(doc, invoice) {
        let y = 220;
        doc
            .fontSize(10)
            .text('Description', 50, 200)
            .text('Qty', 250, 200)
            .text('Rate', 350, 200)
            .text('Amount', 450, 200);
        invoice.items.forEach(item => {
            doc
                .text(item.description, 50, y)
                .text(item.quantity.toString(), 250, y)
                .text((0, helpers_1.formatCurrency)(item.unitPrice), 350, y)
                .text((0, helpers_1.formatCurrency)(item.quantity * item.unitPrice), 450, y);
            y += 15;
        });
    }
    static addTotals(doc, invoice) {
        const y = 400;
        doc
            .fontSize(10)
            .text('Subtotal:', 350, y)
            .text((0, helpers_1.formatCurrency)(invoice.subtotal), 450, y)
            .text('Tax:', 350, y + 15)
            .text((0, helpers_1.formatCurrency)(invoice.taxAmount), 450, y + 15)
            .fontSize(12)
            .text('Total:', 350, y + 35)
            .text((0, helpers_1.formatCurrency)(invoice.totalAmount), 450, y + 35);
    }
    static addFooter(doc) {
        doc
            .fontSize(8)
            .text('Thank you for your business!', 50, 500)
            .text('Terms & Conditions apply', 50, 515);
    }
}
exports.PDFGenerator = PDFGenerator;
//# sourceMappingURL=pdfGenerator.js.map