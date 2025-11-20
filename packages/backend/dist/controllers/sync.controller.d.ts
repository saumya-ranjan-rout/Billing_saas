import { Request, Response } from 'express';
export declare class SyncController {
    private syncService;
    constructor();
    syncData: (req: Request, res: Response) => Promise<void>;
    getUpdates: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=sync.controller.d.ts.map