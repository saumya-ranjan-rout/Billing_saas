"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingService = void 0;
const database_1 = require("../config/database");
const Setting_1 = require("../entities/Setting");
const typeorm_1 = require("typeorm");
class SettingService {
    constructor() {
        this.repo = database_1.AppDataSource.getRepository(Setting_1.Setting);
    }
    async getByTenant(tenantId) {
        return await this.repo.findOne({ where: { tenantId } });
    }
    async update(tenantId, data) {
        let settings = await this.repo.findOne({ where: { tenantId } });
        if (data.contactEmail) {
            const existingEmail = await this.repo.findOne({
                where: { contactEmail: data.contactEmail, tenantId: (0, typeorm_1.Not)(tenantId) },
            });
            if (existingEmail) {
                throw new Error('Contact Email already exists');
            }
        }
        if (data.contactPhone) {
            const existingPhone = await this.repo.findOne({
                where: { contactPhone: data.contactPhone, tenantId: (0, typeorm_1.Not)(tenantId) },
            });
            if (existingPhone) {
                throw new Error('Contact Phone already exists');
            }
        }
        if (data.gstNumber) {
            const existingGST = await this.repo.findOne({
                where: { gstNumber: data.gstNumber, tenantId: (0, typeorm_1.Not)(tenantId) },
            });
            if (existingGST) {
                throw new Error('GST Number already exists');
            }
        }
        if (!settings) {
            settings = this.repo.create({ tenantId, ...data });
        }
        else {
            Object.assign(settings, data);
        }
        return await this.repo.save(settings);
    }
}
exports.SettingService = SettingService;
//# sourceMappingURL=SettingService.js.map