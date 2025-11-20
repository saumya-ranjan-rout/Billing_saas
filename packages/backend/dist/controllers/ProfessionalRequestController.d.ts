import { Request, Response } from "express";
export declare class ProfessionalRequestController {
    private service;
    private userRepo;
    createRequest(req: Request, res: Response): Promise<void>;
    getRequests(req: Request, res: Response): Promise<void>;
    getProfessionals(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    updateStatus(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=ProfessionalRequestController.d.ts.map