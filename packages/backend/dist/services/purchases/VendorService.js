"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorService = void 0;
const database_1 = require("../../config/database");
const Vendor_1 = require("../../entities/Vendor");
const logger_1 = __importDefault(require("../../utils/logger"));
class VendorService {
    constructor() {
        this.vendorRepository = database_1.AppDataSource.getRepository(Vendor_1.Vendor);
    }
    async createVendor(tenantId, vendorData) {
        try {
            const vendor = this.vendorRepository.create({
                ...vendorData,
                tenantId
            });
            const savedVendor = await this.vendorRepository.save(vendor);
            const vendorObj = Array.isArray(savedVendor) ? savedVendor[0] : savedVendor;
            return vendorObj;
        }
        catch (error) {
            logger_1.default.error('Error creating vendor:', error);
            throw error;
        }
    }
    async getVendor(tenantId, vendorId) {
        try {
            const vendor = await this.vendorRepository.findOne({
                where: { id: vendorId, tenantId }
            });
            if (!vendor) {
                throw new Error('Vendor not found');
            }
            return vendor;
        }
        catch (error) {
            logger_1.default.error('Error fetching vendor:', error);
            throw error;
        }
    }
    async getVendors(tenantId, options) {
        try {
            const { page, limit, search, isActive } = options;
            const skip = (page - 1) * limit;
            let query = this.vendorRepository
                .createQueryBuilder('vendor')
                .where('vendor.tenantId = :tenantId', { tenantId });
            if (search) {
                query = query.andWhere('(vendor.name ILIKE :search OR vendor.email ILIKE :search OR vendor.contactPerson ILIKE :search)', { search: `%${search}%` });
            }
            if (isActive !== undefined) {
                query = query.andWhere('vendor.isActive = :isActive', { isActive });
            }
            const [vendors, total] = await query
                .skip(skip)
                .take(limit)
                .orderBy('vendor.name', 'ASC')
                .getManyAndCount();
            return {
                data: vendors,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            };
        }
        catch (error) {
            logger_1.default.error('Error fetching vendors:', error);
            throw error;
        }
    }
    async updateVendor(tenantId, vendorId, updateData) {
        try {
            await this.vendorRepository.update({ id: vendorId, tenantId }, updateData);
            return await this.getVendor(tenantId, vendorId);
        }
        catch (error) {
            logger_1.default.error('Error updating vendor:', error);
            throw error;
        }
    }
    async deleteVendor(tenantId, vendorId) {
        try {
            await this.vendorRepository.delete({ id: vendorId, tenantId });
        }
        catch (error) {
            logger_1.default.error('Error deleting vendor:', error);
            throw error;
        }
    }
}
exports.VendorService = VendorService;
//# sourceMappingURL=VendorService.js.map