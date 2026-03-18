"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInvoicePDF = void 0;
const pdfkit_1 = __importDefault(require("pdfkit"));
const path_1 = __importDefault(require("path"));
async function generateInvoicePDF(data) {
    return new Promise((resolve) => {
        const doc = new pdfkit_1.default({ size: "A4", margin: 40 });
        const buffers = [];
        doc.on("data", buffers.push.bind(buffers));
        doc.on("end", () => resolve(Buffer.concat(buffers)));
        const { invoiceNo, invoiceDate, seller, sellerGst, sellerAddr, buyer, buyerGst, buyerAddr, gstRate, bank, terms, } = data;
        const items = Array.isArray(data.items) ? data.items : [];
        const watermarkPath = path_1.default.resolve(__dirname, "../../public/background.png");
        const wmWidth = 350;
        const wmHeight = 350;
        const wmX = (doc.page.width - wmWidth) / 2;
        const wmY = (doc.page.height - wmHeight) / 2;
        doc.save();
        doc.opacity(0.08);
        doc.image(watermarkPath, wmX, wmY, {
            width: wmWidth,
            height: wmHeight,
        });
        doc.restore();
        if (data.logo && data.logo.startsWith("data:image")) {
            const base64 = data.logo.replace(/^data:image\/\w+;base64,/, "");
            const logoBuffer = Buffer.from(base64, "base64");
            doc.image(logoBuffer, 40, 40, { width: 70 });
        }
        doc
            .font("Helvetica-Bold")
            .fontSize(16)
            .text("GST TAX INVOICE", 0, 40, { align: "center" });
        doc
            .font("Helvetica")
            .fontSize(10)
            .text(`Invoice No: ${invoiceNo}`, 380, 80)
            .text(`Date: ${invoiceDate}`, 380, 95);
        doc.moveTo(40, 115).lineTo(555, 115).strokeColor("#ddd").stroke();
        doc.font("Helvetica-Bold").text("Seller Details", 40, 130);
        doc.text("Buyer Details", 300, 130);
        doc.font("Helvetica").fontSize(10);
        doc.text(seller, 40, 150);
        doc.text(`GSTIN: ${sellerGst || "-"}`, 40, 165);
        doc.text(`Address: ${sellerAddr || "-"}`, 40, 180, { width: 220 });
        doc.text(buyer, 300, 150);
        doc.text(`GSTIN: ${buyerGst || "-"}`, 300, 165);
        doc.text(`Address: ${buyerAddr || "-"}`, 300, 180, { width: 220 });
        doc.moveTo(40, 215).lineTo(555, 215).strokeColor("#ddd").stroke();
        let y = 230;
        doc
            .rect(40, y, 515, 22)
            .fill("#f5f6f7")
            .fillColor("black");
        doc
            .font("Helvetica-Bold")
            .fontSize(10)
            .text("Description", 45, y + 6)
            .text("HSN", 260, y + 6)
            .text("Qty", 310, y + 6)
            .text("Rate", 360, y + 6)
            .text("Amount", 450, y + 6);
        y += 30;
        doc.font("Helvetica");
        let subtotal = 0;
        items.forEach((item) => {
            const amount = item.qty * item.rate;
            subtotal += amount;
            doc
                .text(item.description || "-", 45, y, { width: 200 })
                .text(item.hsn || "-", 260, y)
                .text(item.qty?.toString() || "0", 310, y)
                .text(item.rate?.toFixed(2) || "0.00", 360, y)
                .text(amount.toFixed(2), 450, y);
            y += 20;
        });
        doc.moveTo(40, y + 5).lineTo(555, y + 5).strokeColor("#ddd").stroke();
        const gstAmount = (subtotal * gstRate) / 100;
        const grandTotal = subtotal + gstAmount;
        const labelX = 350;
        const valueX = 480;
        y += 20;
        doc.font("Helvetica");
        doc.text("Subtotal:", labelX, y, { width: 120, align: "right" });
        doc.text(subtotal.toFixed(2), valueX, y, { width: 70, align: "right" });
        y += 15;
        doc.text(`GST (${gstRate}%):`, labelX, y, { width: 120, align: "right" });
        doc.text(gstAmount.toFixed(2), valueX, y, { width: 70, align: "right" });
        y += 20;
        doc.font("Helvetica-Bold");
        doc.text("Grand Total:", labelX, y, { width: 120, align: "right" });
        doc.text(`₹ ${grandTotal.toFixed(2)}`, valueX, y, { width: 70, align: "right" });
        doc.moveTo(40, y + 25).lineTo(555, y + 25).strokeColor("#ddd").stroke();
        y += 40;
        doc.font("Helvetica-Bold").text("Bank Details:", 40, y);
        doc.font("Helvetica").text(bank || "-", 40, y + 15);
        y += 55;
        doc.font("Helvetica-Bold").text("Terms & Conditions:", 40, y);
        doc.font("Helvetica").text(terms || "Payment due within 15 days.", 40, y + 15);
        doc
            .fontSize(9)
            .fillColor("#666")
            .text("This is a computer generated invoice.", 0, 770, {
            align: "center",
        });
        doc.end();
    });
}
exports.generateInvoicePDF = generateInvoicePDF;
//# sourceMappingURL=generateInvoicePDF.js.map