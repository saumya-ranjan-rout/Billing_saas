import PDFDocument from 'pdfkit';
import type PDFKit from 'pdfkit';

import { Invoice, Customer } from '../types/customTypes';
import { formatCurrency, formatDate } from './helpers';

export class PDFGenerator {
  static async generateInvoicePDF(
    invoice: Invoice,
    customer: Customer
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const buffers: Buffer[] = [];

        doc.on('data', (chunk: Buffer) => buffers.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(buffers)));

        this.addHeader(doc, invoice);
        this.addCustomerInfo(doc, customer);
        this.addInvoiceDetails(doc, invoice);
        this.addItemsTable(doc, invoice);
        this.addTotals(doc, invoice);
        this.addFooter(doc);

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }

  private static addHeader(
    doc: PDFKit.PDFDocument,
    invoice: Invoice
  ): void {
    doc
      .fontSize(20)
      .text('INVOICE', 50, 50)
      .fontSize(10)
      .text(`Invoice #: ${invoice.invoiceNumber}`, 50, 80)
      .text(`Issue Date: ${formatDate(invoice.issueDate)}`, 50, 95)
      .text(`Due Date: ${formatDate(invoice.dueDate)}`, 50, 110);
  }

  private static addCustomerInfo(
    doc: PDFKit.PDFDocument,
    customer: Customer
  ): void {
    doc
      .fontSize(12)
      .text('Bill To:', 350, 80)
      .fontSize(10)
      .text(customer.name, 350, 95)
      .text(customer.email, 350, 110);
  }

  private static addInvoiceDetails(
    doc: PDFKit.PDFDocument,
    invoice: Invoice
  ): void {
    doc
      .fontSize(10)
      .text(`Status: ${invoice.status.toUpperCase()}`, 50, 140)
      .text(`Payment Terms: ${invoice.paymentTerms} days`, 50, 155);
  }

  private static addItemsTable(
    doc: PDFKit.PDFDocument,
    invoice: Invoice
  ): void {
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
        .text(formatCurrency(item.unitPrice), 350, y)
        .text(formatCurrency(item.quantity * item.unitPrice), 450, y);
      y += 15;
    });
  }

  private static addTotals(
    doc: PDFKit.PDFDocument,
    invoice: Invoice
  ): void {
    const y = 400;

    doc
      .fontSize(10)
      .text('Subtotal:', 350, y)
      .text(formatCurrency(invoice.subtotal), 450, y)
      .text('Tax:', 350, y + 15)
      .text(formatCurrency(invoice.taxAmount), 450, y + 15)
      .fontSize(12)
      .text('Total:', 350, y + 35)
      .text(formatCurrency(invoice.totalAmount), 450, y + 35);
  }

  private static addFooter(doc: PDFKit.PDFDocument): void {
    doc
      .fontSize(8)
      .text('Thank you for your business!', 50, 500)
      .text('Terms & Conditions apply', 50, 515);
  }
}
