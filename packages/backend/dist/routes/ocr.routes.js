"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ocr_controller_1 = require("../controllers/ocr.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
const ocrController = new ocr_controller_1.OCRController();
router.post('/receipt', auth_middleware_1.authenticateToken, ocrController.processReceipt);
router.post('/invoice', auth_middleware_1.authenticateToken, ocrController.processInvoice);
exports.default = router;
//# sourceMappingURL=ocr.routes.js.map