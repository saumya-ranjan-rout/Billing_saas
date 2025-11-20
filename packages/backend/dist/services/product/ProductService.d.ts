import { Product, ProductType, StockStatus } from '../../entities/Product';
import { PaginatedResponse } from '../../types/customTypes';
interface CreateProductData extends Partial<Product> {
    categoryName?: string;
}
interface UpdateProductData {
    categoryName?: string;
    categoryId?: string;
    [key: string]: any;
}
export declare class ProductService {
    private productRepository;
    private categoryRepository;
    constructor();
    private calculateStockStatus;
    private findOrCreateCategory;
    createProduct(tenantId: string, productData: CreateProductData): Promise<Product>;
    getProduct(tenantId: string, productId: string): Promise<Product>;
    getProducts(tenantId: string, options: {
        page: number;
        limit: number;
        search?: string;
        categoryId?: string;
        type?: ProductType;
        stockStatus?: StockStatus;
        isActive?: boolean;
    }): Promise<PaginatedResponse<Product>>;
    updateProduct(tenantId: string, productId: string, updates: UpdateProductData): Promise<Product>;
    updateProductStock(tenantId: string, productId: string, quantity: number, operation: 'add' | 'subtract'): Promise<Product>;
    deleteProduct(tenantId: string, productId: string): Promise<void>;
    searchProducts(tenantId: string, query: string): Promise<Product[]>;
    getProductsByCategory(tenantId: string, categoryId: string): Promise<Product[]>;
    getLowStockProducts(tenantId: string): Promise<Product[]>;
    getProductSummary(tenantId: string): Promise<any>;
}
export {};
//# sourceMappingURL=ProductService.d.ts.map