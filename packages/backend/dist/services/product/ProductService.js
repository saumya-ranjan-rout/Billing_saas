"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const typeorm_1 = require("typeorm");
const database_1 = require("../../config/database");
const Product_1 = require("../../entities/Product");
const Category_1 = require("../../entities/Category");
const logger_1 = __importDefault(require("../../utils/logger"));
class ProductService {
    constructor() {
        this.productRepository = database_1.AppDataSource.getRepository(Product_1.Product);
        this.categoryRepository = database_1.AppDataSource.getRepository(Category_1.Category);
    }
    calculateStockStatus(stockQuantity, lowStockThreshold) {
        if (stockQuantity <= 0)
            return Product_1.StockStatus.OUT_OF_STOCK;
        if (stockQuantity <= lowStockThreshold)
            return Product_1.StockStatus.LOW_STOCK;
        return Product_1.StockStatus.IN_STOCK;
    }
    async findOrCreateCategory(tenantId, categoryName) {
        try {
            let category = await this.categoryRepository.findOne({
                where: {
                    name: (0, typeorm_1.ILike)(`%${categoryName}%`),
                    tenantId,
                    deletedAt: (0, typeorm_1.IsNull)()
                }
            });
            if (!category) {
                category = this.categoryRepository.create({
                    name: categoryName.trim(),
                    description: `Automatically created category for ${categoryName}`,
                    tenantId,
                    isActive: true
                });
                category = await this.categoryRepository.save(category);
                logger_1.default.info(`Auto-created category: ${categoryName} for tenant: ${tenantId}`);
            }
            return category;
        }
        catch (error) {
            logger_1.default.error('Error in findOrCreateCategory:', error);
            throw error;
        }
    }
    async createProduct(tenantId, productData) {
        try {
            const { categoryName, ...productFields } = productData;
            let finalCategoryId = productFields.categoryId;
            if (categoryName && !productFields.categoryId) {
                const category = await this.findOrCreateCategory(tenantId, categoryName);
                finalCategoryId = category.id;
            }
            if (finalCategoryId) {
                const category = await this.categoryRepository.findOne({
                    where: { id: finalCategoryId, tenantId, deletedAt: (0, typeorm_1.IsNull)() }
                });
                if (!category) {
                    throw new Error('Category not found');
                }
                productFields.categoryId = finalCategoryId;
            }
            if (productFields.sku) {
                const existingProduct = await this.productRepository.findOne({
                    where: { sku: productFields.sku, tenantId, deletedAt: (0, typeorm_1.IsNull)() }
                });
                if (existingProduct) {
                    throw new Error('Product with this SKU already exists');
                }
            }
            const stockStatus = this.calculateStockStatus(productFields.stockQuantity || 0, productFields.lowStockThreshold || 0);
            const product = this.productRepository.create({
                ...productFields,
                stockStatus,
                tenantId
            });
            const savedProduct = await this.productRepository.save(product);
            return savedProduct;
        }
        catch (error) {
            logger_1.default.error('Error creating product:', error);
            throw error;
        }
    }
    async getProduct(tenantId, productId) {
        try {
            const product = await this.productRepository.findOne({
                where: { id: productId, tenantId, deletedAt: (0, typeorm_1.IsNull)() },
                relations: ['category']
            });
            if (!product) {
                throw new Error('Product not found');
            }
            return product;
        }
        catch (error) {
            logger_1.default.error('Error fetching product:', error);
            throw error;
        }
    }
    async getProducts(tenantId, options) {
        try {
            const { page, limit, search, categoryId, type, stockStatus, isActive } = options;
            const skip = (page - 1) * limit;
            let whereConditions = {
                tenantId,
                deletedAt: (0, typeorm_1.IsNull)()
            };
            if (categoryId) {
                whereConditions.categoryId = categoryId;
            }
            if (type) {
                whereConditions.type = type;
            }
            if (stockStatus) {
                whereConditions.stockStatus = stockStatus;
            }
            if (isActive !== undefined) {
                whereConditions.isActive = isActive;
            }
            if (search) {
                whereConditions = [
                    { ...whereConditions, name: (0, typeorm_1.ILike)(`%${search}%`) },
                    { ...whereConditions, sku: (0, typeorm_1.ILike)(`%${search}%`) },
                    { ...whereConditions, description: (0, typeorm_1.ILike)(`%${search}%`) }
                ];
            }
            const [products, total] = await this.productRepository.findAndCount({
                where: whereConditions,
                relations: ['category'],
                skip,
                take: limit,
                order: { createdAt: 'DESC' }
            });
            return {
                data: products,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            };
        }
        catch (error) {
            logger_1.default.error('Error fetching products:', error);
            throw error;
        }
    }
    async updateProduct(tenantId, productId, updates) {
        try {
            const product = await this.getProduct(tenantId, productId);
            const { categoryName, ...updateFields } = updates;
            let finalCategoryId = updateFields.categoryId;
            if (categoryName && !updateFields.categoryId) {
                const category = await this.findOrCreateCategory(tenantId, categoryName);
                finalCategoryId = category.id;
            }
            if (finalCategoryId) {
                const category = await this.categoryRepository.findOne({
                    where: { id: finalCategoryId, tenantId, deletedAt: (0, typeorm_1.IsNull)() }
                });
                if (!category) {
                    throw new Error('Category not found');
                }
                updateFields.categoryId = finalCategoryId;
            }
            if (updateFields.sku && updateFields.sku !== product.sku) {
                const existingProduct = await this.productRepository.findOne({
                    where: { sku: updateFields.sku, tenantId, deletedAt: (0, typeorm_1.IsNull)() }
                });
                if (existingProduct && existingProduct.id !== productId) {
                    throw new Error('Product with this SKU already exists');
                }
            }
            if (updateFields.stockQuantity !== undefined || updateFields.lowStockThreshold !==
                undefined) {
                const stockQuantity = updateFields.stockQuantity !== undefined ?
                    updateFields.stockQuantity : product.stockQuantity;
                const lowStockThreshold = updateFields.lowStockThreshold !== undefined ?
                    updateFields.lowStockThreshold : product.lowStockThreshold;
                updateFields.stockStatus = this.calculateStockStatus(stockQuantity, lowStockThreshold);
            }
            Object.assign(product, updateFields);
            return await this.productRepository.save(product);
        }
        catch (error) {
            logger_1.default.error('Error updating product:', error);
            throw error;
        }
    }
    async updateProductStock(tenantId, productId, quantity, operation) {
        const queryRunner = database_1.AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const product = await this.getProduct(tenantId, productId);
            if (product.type !== Product_1.ProductType.GOODS) {
                throw new Error('Only goods products can have stock updated');
            }
            let newStockQuantity = product.stockQuantity;
            if (operation === 'add') {
                newStockQuantity += quantity;
            }
            else if (operation === 'subtract') {
                if (product.stockQuantity < quantity) {
                    throw new Error('Insufficient stock');
                }
                newStockQuantity -= quantity;
            }
            product.stockQuantity = newStockQuantity;
            product.stockStatus = this.calculateStockStatus(newStockQuantity, product.lowStockThreshold);
            const updatedProduct = await queryRunner.manager.save(product);
            await queryRunner.commitTransaction();
            return updatedProduct;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            logger_1.default.error('Error updating product stock:', error);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async deleteProduct(tenantId, productId) {
        try {
            const product = await this.getProduct(tenantId, productId);
            product.deletedAt = new Date();
            await this.productRepository.save(product);
        }
        catch (error) {
            logger_1.default.error('Error deleting product:', error);
            throw error;
        }
    }
    async searchProducts(tenantId, query) {
        try {
            if (!query || query.length < 2) {
                throw new Error('Search query must be at least 2 characters long');
            }
            const products = await this.productRepository.find({
                where: [
                    { tenantId, name: (0, typeorm_1.ILike)(`%${query}%`), deletedAt: (0, typeorm_1.IsNull)() },
                    { tenantId, sku: (0, typeorm_1.ILike)(`%${query}%`), deletedAt: (0, typeorm_1.IsNull)() },
                    { tenantId, description: (0, typeorm_1.ILike)(`%${query}%`), deletedAt: (0, typeorm_1.IsNull)() }
                ],
                take: 10,
                relations: ['category']
            });
            return products;
        }
        catch (error) {
            logger_1.default.error('Error searching products:', error);
            throw error;
        }
    }
    async getProductsByCategory(tenantId, categoryId) {
        try {
            const products = await this.productRepository.find({
                where: { tenantId, categoryId, deletedAt: (0, typeorm_1.IsNull)(), isActive: true },
                relations: ['category'],
                order: { name: 'ASC' }
            });
            return products;
        }
        catch (error) {
            logger_1.default.error('Error fetching products by category:', error);
            throw error;
        }
    }
    async getLowStockProducts(tenantId) {
        try {
            const products = await this.productRepository.find({
                where: {
                    tenantId,
                    stockStatus: Product_1.StockStatus.LOW_STOCK,
                    deletedAt: (0, typeorm_1.IsNull)(),
                    isActive: true
                },
                relations: ['category'],
                order: { stockQuantity: 'ASC' }
            });
            return products;
        }
        catch (error) {
            logger_1.default.error('Error fetching low stock products:', error);
            throw error;
        }
    }
    async getProductSummary(tenantId) {
        try {
            const summary = await this.productRepository
                .createQueryBuilder('product')
                .select('product.type', 'type')
                .addSelect('COUNT(product.id)', 'count')
                .addSelect('SUM(product.stockQuantity)', 'totalStock')
                .addSelect('SUM(product.stockQuantity * product.costPrice)', 'totalInventoryValue')
                .where('product.tenantId = :tenantId', { tenantId })
                .andWhere('product.deletedAt IS NULL')
                .andWhere('product.isActive = true')
                .groupBy('product.type')
                .getRawMany();
            return summary;
        }
        catch (error) {
            logger_1.default.error('Error fetching product summary:', error);
            throw error;
        }
    }
}
exports.ProductService = ProductService;
//# sourceMappingURL=ProductService.js.map