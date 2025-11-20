import { Request, Response } from "express";
import { UserService } from "../services/user/UserService";
import { CacheService } from "../services/cache/CacheService";
export declare class UserController {
    private userService;
    private cacheService;
    constructor(userService: UserService, cacheService: CacheService);
    createUser(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getUser(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getUsers(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    updateUser(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    deleteUser(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    resetPassword(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=UserController.d.ts.map