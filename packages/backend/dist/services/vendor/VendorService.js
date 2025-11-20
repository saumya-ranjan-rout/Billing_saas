"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorService = void 0;
const typeorm_1 = require("typeorm");
const database_1 = require("../../config/database");
const Vendor_1 = require("../../entities/Vendor");
const validators_1 = require("../../utils/validators");
const logger_1 = __importDefault(require("../../utils/logger"));
class VendorService {
    constructor() {
        this.vendorRepository = database_1.AppDataSource.getRepository(Vendor_1.Vendor);
    }
    async createVendor(tenantId, vendorData) {
        try {
            if (vendorData.gstin && !(0, validators_1.validateGSTIN)(vendorData.gstin)) {
                throw new Error('Invalid GSTIN format');
            }
            if (vendorData.pan && !(0, validators_1.validatePAN)(vendorData.pan)) {
                throw new Error('Invalid PAN format');
            }
            const existingVendor = await this.vendorRepository.findOne({
                where: { name: vendorData.name, tenantId, deletedAt: (0, typeorm_1.IsNull)() }
            });
            if (existingVendor) {
                throw new Error('Vendor with this name already exists');
            }
            const vendor = this.vendorRepository.create({
                ...vendorData,
                tenantId
            });
            const savedVendor = await this.vendorRepository.save(vendor);
            return savedVendor;
        }
        catch (error) {
            logger_1.default.error('Error creating vendor:', error);
            throw error;
        }
    }
    async getVendor(tenantId, vendorId) {
        try {
            const vendor = await this.vendorRepository.findOne({
                where: { id: vendorId, tenantId, deletedAt: (0, typeorm_1.IsNull)() },
                relations: ['tenant']
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
            const { page, limit, search } = options;
            const skip = (page - 1) * limit;
            let whereConditions = { tenantId, deletedAt: (0, typeorm_1.IsNull)() };
            if (search) {
                whereConditions = [
                    { tenantId, name: (0, typeorm_1.ILike)(`%${search}%`), deletedAt: (0, typeorm_1.IsNull)() },
                    { tenantId, email: (0, typeorm_1.ILike)(`%${search}%`), deletedAt: (0, typeorm_1.IsNull)() },
                    { tenantId, phone: (0, typeorm_1.ILike)(`%${search}%`), deletedAt: (0, typeorm_1.IsNull)() }
                ];
            }
            const [vendors, total] = await this.vendorRepository.findAndCount({
                where: whereConditions,
                skip,
                take: limit,
                order: { createdAt: 'DESC' }
            });
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
    async updateVendor(tenantId, vendorId, updates) {
        try {
            if (updates.gstin && !(0, validators_1.validateGSTIN)(updates.gstin)) {
                throw new Error('Invalid GSTIN format');
            }
            if (updates.pan && !(0, validators_1.validatePAN)(updates.pan)) {
                throw new Error('Invalid PAN format');
            }
            const vendor = await this.getVendor(tenantId, vendorId);
            if (updates.name && updates.name !== vendor.name) {
                const existingVendor = await this.vendorRepository.findOne({
                    where: { name: updates.name, tenantId, deletedAt: (0, typeorm_1.IsNull)() }
                });
                if (existingVendor && existingVendor.id !== vendorId) {
                    throw new Error('Vendor with this name already exists');
                }
            }
            Object.assign(vendor, updates);
            return await this.vendorRepository.save(vendor);
        }
        catch (error) {
            logger_1.default.error('Error updating vendor:', error);
            throw error;
        }
    }
    async deleteVendor(tenantId, vendorId) {
        try {
            const vendor = await this.getVendor(tenantId, vendorId);
            vendor.deletedAt = new Date();
            await this.vendorRepository.save(vendor);
        }
        catch (error) {
            logger_1.default.error('Error deleting vendor:', error);
            throw error;
        }
    }
    async searchVendors(tenantId, query) {
        try {
            if (!query || query.length < 2) {
                throw new Error('Search query must be at least 2 characters long');
            }
            const vendors = await this.vendorRepository.find({
                where: [
                    { tenantId, name: (0, typeorm_1.ILike)(`%${query}%`), deletedAt: (0, typeorm_1.IsNull)() },
                    { tenantId, email: (0, typeorm_1.ILike)(`%${query}%`), deletedAt: (0, typeorm_1.IsNull)() },
                    { tenantId, phone: (0, typeorm_1.ILike)(`%${query}%`), deletedAt: (0, typeorm_1.IsNull)() },
                    { tenantId, gstin: (0, typeorm_1.ILike)(`%${query}%`), deletedAt: (0, typeorm_1.IsNull)() }
                ],
                take: 10
            });
            return vendors;
        }
        catch (error) {
            logger_1.default.error('Error searching vendors:', error);
            throw error;
        }
    }
    async getVendorByGSTIN(tenantId, gstin) {
        try {
            const vendor = await this.vendorRepository.findOne({
                where: { tenantId, gstin, deletedAt: (0, typeorm_1.IsNull)() }
            });
            return vendor;
        }
        catch (error) {
            logger_1.default.error('Error fetching vendor by GSTIN:', error);
            throw error;
        }
    }
    async updateOutstandingBalance(tenantId, vendorId, amount) {
        try {
            const vendor = await this.getVendor(tenantId, vendorId);
            vendor.outstandingBalance = Number(vendor.outstandingBalance) + amount;
            await this.vendorRepository.save(vendor);
        }
        catch (error) {
            logger_1.default.error('Error updating vendor balance:', error);
            throw error;
        }
    }
}
exports.VendorService = VendorService;
//# sourceMappingURL=VendorService.js.map