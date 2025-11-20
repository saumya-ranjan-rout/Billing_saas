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
                doc.on('data', buffers.push.bind(buffers));
                doc.on('end', () => {
                    const pdfData = Buffer.concat(buffers);
                    resolve(pdfData);
                });
                this.addHeader(doc, invoice);
                this.addCustomerInfo(doc, customer);
                this.addInvoiceDetails(doc, invoice);
                this.addItemsTable(doc, invoice);
                this.addTotals(doc, invoice);
                this.addFooter(doc);
                doc.end();
            }
            catch (error) {
                reject(error);
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
        if (customer.address) {
            doc.text(customer.address.street, 350, 125);
            doc.text(`${customer.address.city}, ${customer.address.state} ${customer.address.pincode}`, 350, 140);
            doc.text(customer.address.country, 350, 155);
        }
    }
    static addInvoiceDetails(doc, invoice) {
        doc
            .fontSize(10)
            .text(`Status: ${invoice.status.toUpperCase()}`, 50, 140)
            .text(`Payment Terms: ${invoice.paymentTerms} days`, 50, 155);
    }
    static addItemsTable(doc, invoice) {
        const tableTop = 200;
        doc
            .fontSize(10)
            .text('Description', 50, tableTop)
            .text('Quantity', 250, tableTop)
            .text('Unit Price', 350, tableTop)
            .text('Amount', 450, tableTop);
        let y = tableTop + 20;
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
        const totalsY = 400;
        doc
            .fontSize(10)
            .text('Subtotal:', 350, totalsY)
            .text((0, helpers_1.formatCurrency)(invoice.subtotal), 450, totalsY)
            .text('Tax:', 350, totalsY + 15)
            .text((0, helpers_1.formatCurrency)(invoice.taxAmount), 450, totalsY + 15)
            .fontSize(12)
            .text('Total:', 350, totalsY + 35)
            .text((0, helpers_1.formatCurrency)(invoice.totalAmount), 450, totalsY + 35);
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