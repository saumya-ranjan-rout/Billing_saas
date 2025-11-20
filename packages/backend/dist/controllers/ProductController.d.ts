import { Request, Response } from 'express';
import { ProductService } from '../services/product/ProductService';
import { CategoryService } from '../services/product/CategoryService';
import { CacheService } from '../services/cache/CacheService';
export declare class ProductController {
    private productService;
    private categoryService;
    private cacheService;
    constructor(productService: ProductService, categoryService: CategoryService, cacheService: CacheService);
    createProduct(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getProduct(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getProducts(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    updateProduct(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    updateProductStock(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    deleteProduct(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    searchProducts(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getProductsByCategory(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getLowStockProducts(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getProductSummary(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    createCategory(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getCategories(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getCategoryTree(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    deleteCategory(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=ProductController.d.ts.map