"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OCRController = void 0;
const ocr_service_1 = require("../services/ocr.service");
class OCRController {
    constructor() {
        this.processReceipt = async (req, res) => {
            try {
                const { image } = req.body;
                const result = await this.ocrService.processReceipt(image);
                res.json({ success: true, result });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'OCR processing failed'
                });
            }
        };
        this.processInvoice = async (req, res) => {
            try {
                const { image } = req.body;
                const result = await this.ocrService.processInvoice(image);
                res.json({ success: true, result });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'OCR processing failed'
                });
            }
        };
        this.ocrService = new ocr_service_1.OCRService();
    }
}
exports.OCRController = OCRController;
//# sourceMappingURL=ocr.controller.js.map