import { Request, Response } from 'express';
export declare class OCRController {
    private ocrService;
    constructor();
    processReceipt: (req: Request, res: Response) => Promise<void>;
    processInvoice: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=ocr.controller.d.ts.map