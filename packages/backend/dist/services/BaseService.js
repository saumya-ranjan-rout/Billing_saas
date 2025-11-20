"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantAwareService = exports.BaseService = void 0;
const errors_1 = require("../utils/errors");
class BaseService {
    constructor(repository) {
        this.repository = repository;
    }
    async findById(id, relations = []) {
        const entity = await this.repository.findOne({
            where: { id },
            relations,
        });
        if (!entity) {
            throw new errors_1.NotFoundError(`${this.repository.metadata.name} not found`);
        }
        return entity;
    }
    async findAll(options) {
        return this.repository.find(options);
    }
    async create(data) {
        const entity = this.repository.create(data);
        return this.repository.save(entity);
    }
    async update(id, data) {
        const entity = await this.findById(id);
        Object.assign(entity, data);
        return this.repository.save(entity);
    }
    async delete(id) {
        const entity = await this.findById(id);
        await this.repository.remove(entity);
    }
    async exists(where) {
        const count = await this.repository.count({ where });
        return count > 0;
    }
}
exports.BaseService = BaseService;
class TenantAwareService extends BaseService {
    constructor(repository) {
        super(repository);
    }
    async findAllByTenant(tenantId, options) {
        return this.repository.find({
            where: { tenantId },
            ...options,
        });
    }
    async findByIdAndTenant(id, tenantId, relations = []) {
        const entity = await this.repository.findOne({
            where: { id, tenantId },
            relations,
        });
        if (!entity) {
            throw new errors_1.NotFoundError(`${this.repository.metadata.name} not found`);
        }
        return entity;
    }
}
exports.TenantAwareService = TenantAwareService;
//# sourceMappingURL=BaseService.js.map