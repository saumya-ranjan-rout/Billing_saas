"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const typeorm_1 = require("typeorm");
const database_1 = require("../../config/database");
const Category_1 = require("../../entities/Category");
const Product_1 = require("../../entities/Product");
const logger_1 = __importDefault(require("../../utils/logger"));
class CategoryService {
    constructor() {
        this.categoryRepository = database_1.AppDataSource.getRepository(Category_1.Category);
        this.productRepository = database_1.AppDataSource.getRepository(Product_1.Product);
    }
    async createCategory(tenantId, categoryData) {
        try {
            if (categoryData.parentId) {
                const parentCategory = await this.categoryRepository.findOne({
                    where: { id: categoryData.parentId, tenantId, deletedAt: (0, typeorm_1.IsNull)() }
                });
                if (!parentCategory) {
                    throw new Error('Parent category not found');
                }
            }
            const existingCategory = await this.categoryRepository.findOne({
                where: { name: categoryData.name, tenantId, deletedAt: (0, typeorm_1.IsNull)() }
            });
            if (existingCategory) {
                throw new Error('Category with this name already exists');
            }
            const category = this.categoryRepository.create({
                ...categoryData,
                tenantId
            });
            const savedCategory = await this.categoryRepository.save(category);
            return savedCategory;
        }
        catch (error) {
            logger_1.default.error('Error creating category:', error);
            throw error;
        }
    }
    async getCategory(tenantId, categoryId) {
        try {
            const category = await this.categoryRepository.findOne({
                where: { id: categoryId, tenantId, deletedAt: (0, typeorm_1.IsNull)() },
                relations: ['parent', 'children']
            });
            if (!category) {
                throw new Error('Category not found');
            }
            return category;
        }
        catch (error) {
            logger_1.default.error('Error fetching category:', error);
            throw error;
        }
    }
    async getCategories(tenantId, options) {
        try {
            const { page, limit, search, parentId, isActive } = options;
            const skip = (page - 1) * limit;
            let whereConditions = { tenantId, deletedAt: (0, typeorm_1.IsNull)() };
            if (parentId !== undefined) {
                whereConditions.parentId = parentId;
            }
            if (isActive !== undefined) {
                whereConditions.isActive = isActive;
            }
            if (search) {
                whereConditions = [
                    { ...whereConditions, name: (0, typeorm_1.ILike)(`%${search}%`) },
                    { ...whereConditions, description: (0, typeorm_1.ILike)(`%${search}%`) }
                ];
            }
            const [categories, total] = await this.categoryRepository.findAndCount({
                where: whereConditions,
                relations: ['parent', 'children'],
                skip,
                take: limit,
                order: { name: 'ASC' }
            });
            return {
                data: categories,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            };
        }
        catch (error) {
            logger_1.default.error('Error fetching categories:', error);
            throw error;
        }
    }
    async updateCategory(tenantId, categoryId, updates) {
        try {
            const category = await this.getCategory(tenantId, categoryId);
            if (updates.parentId) {
                if (updates.parentId === categoryId) {
                    throw new Error('Category cannot be its own parent');
                }
                const parentCategory = await this.categoryRepository.findOne({
                    where: { id: updates.parentId, tenantId, deletedAt: (0, typeorm_1.IsNull)() }
                });
                if (!parentCategory) {
                    throw new Error('Parent category not found');
                }
            }
            if (updates.name && updates.name !== category.name) {
                const existingCategory = await this.categoryRepository.findOne({
                    where: { name: updates.name, tenantId, deletedAt: (0, typeorm_1.IsNull)() }
                });
                if (existingCategory && existingCategory.id !== categoryId) {
                    throw new Error('Category with this name already exists');
                }
            }
            Object.assign(category, updates);
            return await this.categoryRepository.save(category);
        }
        catch (error) {
            logger_1.default.error('Error updating category:', error);
            throw error;
        }
    }
    async deleteCategory(tenantId, categoryId) {
        try {
            const category = await this.getCategory(tenantId, categoryId);
            const productCount = await this.productRepository.count({
                where: { categoryId, tenantId, deletedAt: (0, typeorm_1.IsNull)() }
            });
            if (productCount > 0) {
                throw new Error('Cannot delete category with associated products');
            }
            const childrenCount = await this.categoryRepository.count({
                where: { parentId: categoryId, tenantId, deletedAt: (0, typeorm_1.IsNull)() }
            });
            if (childrenCount > 0) {
                throw new Error('Cannot delete category with sub-categories');
            }
            category.deletedAt = new Date();
            await this.categoryRepository.save(category);
        }
        catch (error) {
            logger_1.default.error('Error deleting category:', error);
            throw error;
        }
    }
    async getCategoryTree(tenantId) {
        try {
            const categories = await this.categoryRepository.find({
                where: { tenantId, deletedAt: (0, typeorm_1.IsNull)(), isActive: true },
                relations: ['children', 'parent'],
                order: { name: 'ASC' }
            });
            const categoryMap = new Map();
            const roots = [];
            categories.forEach(category => {
                categoryMap.set(category.id, { ...category, children: [] });
            });
            categories.forEach(category => {
                const node = categoryMap.get(category.id);
                if (category.parentId && categoryMap.has(category.parentId)) {
                    const parent = categoryMap.get(category.parentId);
                    parent.children.push(node);
                }
                else {
                    roots.push(node);
                }
            });
            return roots;
        }
        catch (error) {
            logger_1.default.error('Error fetching category tree:', error);
            throw error;
        }
    }
    async getCategoryWithProducts(tenantId, categoryId) {
        try {
            const category = await this.categoryRepository.findOne({
                where: { id: categoryId, tenantId, deletedAt: (0, typeorm_1.IsNull)() },
                relations: ['products', 'children']
            });
            if (!category) {
                throw new Error('Category not found');
            }
            return category;
        }
        catch (error) {
            logger_1.default.error('Error fetching category with products:', error);
            throw error;
        }
    }
}
exports.CategoryService = CategoryService;
//# sourceMappingURL=CategoryService.js.map