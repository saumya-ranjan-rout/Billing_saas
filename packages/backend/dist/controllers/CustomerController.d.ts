import { Request, Response } from 'express';
import { CustomerService } from '../services/customer/CustomerService';
import { CacheService } from '../services/cache/CacheService';
import { AuthService } from '../services/auth/AuthService';
import { User } from "../entities/User";
export declare class CustomerController {
    private customerService;
    private cacheService;
    private authService;
    private userRepo;
    private jwt;
    constructor(customerService: CustomerService, cacheService: CacheService, authService: AuthService, userRepo?: import("typeorm").Repository<User>);
    createCustomer(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getCustomer(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getCustomers(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    updateCustomer(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    deleteCustomer(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    searchCustomers(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getCustomersWithInvoices(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    updateUser(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    switchTenant(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=CustomerController.d.ts.map