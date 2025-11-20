"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingService = void 0;
const database_1 = require("../config/database");
const Setting_1 = require("../entities/Setting");
class SettingService {
    constructor() {
        this.repo = database_1.AppDataSource.getRepository(Setting_1.Setting);
    }
    async getByTenant(tenantId) {
        return await this.repo.findOne({ where: { tenantId } });
    }
    async update(tenantId, data) {
        let settings = await this.repo.findOne({ where: { tenantId } });
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