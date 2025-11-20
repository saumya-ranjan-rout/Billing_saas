import { Category } from '../../entities/Category';
import { PaginatedResponse } from '../../types/customTypes';
export declare class CategoryService {
    private categoryRepository;
    private productRepository;
    constructor();
    createCategory(tenantId: string, categoryData: Partial<Category>): Promise<Category>;
    getCategory(tenantId: string, categoryId: string): Promise<Category>;
    getCategories(tenantId: string, options: {
        page: number;
        limit: number;
        search?: string;
        parentId?: string;
        isActive?: boolean;
    }): Promise<PaginatedResponse<Category>>;
    updateCategory(tenantId: string, categoryId: string, updates: any): Promise<Category>;
    deleteCategory(tenantId: string, categoryId: string): Promise<void>;
    getCategoryTree(tenantId: string): Promise<Category[]>;
    getCategoryWithProducts(tenantId: string, categoryId: string): Promise<Category>;
}
//# sourceMappingURL=CategoryService.d.ts.map