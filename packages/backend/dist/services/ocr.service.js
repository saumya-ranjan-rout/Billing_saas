"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OCRService = void 0;
const tesseract_js_1 = require("tesseract.js");
class OCRService {
    constructor() {
        this.initializeWorker();
    }
    async initializeWorker() {
        this.worker = (0, tesseract_js_1.createWorker)();
        await this.worker.load();
        await this.worker.loadLanguage('eng');
        await this.worker.initialize('eng');
    }
    async processReceipt(imageBase64) {
        try {
            const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
            const imageBuffer = Buffer.from(base64Data, 'base64');
            const { data: { text } } = await this.worker.recognize(imageBuffer);
            const totalAmount = this.extractTotalAmount(text);
            const date = this.extractDate(text);
            const vendor = this.extractVendor(text);
            return {
                text,
                extractedData: { totalAmount, date, vendor }
            };
        }
        catch (error) {
            throw new Error('Failed to process receipt image');
        }
    }
    async processInvoice(imageBase64) {
        const result = await this.processReceipt(imageBase64);
        const invoiceNumber = this.extractInvoiceNumber(result.text);
        return {
            ...result,
            extractedData: {
                ...result.extractedData,
                invoiceNumber
            }
        };
    }
    extractTotalAmount(text) {
        const patterns = [/total.*?(\d+\.\d{2})/i, /amount.*?(\d+\.\d{2})/i, /(\d+\.\d{2}).*?total/i];
        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match && match[1])
                return parseFloat(match[1]);
        }
        return null;
    }
    extractDate(text) {
        const patterns = [/\d{2}\/\d{2}\/\d{4}/, /\d{4}-\d{2}-\d{2}/, /\d{2}-\d{2}-\d{4}/];
        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match)
                return match[0];
        }
        return null;
    }
    extractVendor(text) {
        const vendors = ['Walmart', 'Amazon', 'Starbucks', 'Target'];
        for (const vendor of vendors) {
            if (text.includes(vendor))
                return vendor;
        }
        return null;
    }
    extractInvoiceNumber(text) {
        const patterns = [/invoice.*?(\d+)/i, /inv.*?(\d+)/i, /#\s*(\d+)/];
        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match && match[1])
                return match[1];
        }
        return null;
    }
}
exports.OCRService = OCRService;
//# sourceMappingURL=ocr.service.js.map