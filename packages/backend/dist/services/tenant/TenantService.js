"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantService = void 0;
const Tenant_1 = require("../../entities/Tenant");
const BaseService_1 = require("../BaseService");
const StripeService_1 = require("../billing/StripeService");
const errors_1 = require("../../utils/errors");
const database_1 = require("../../config/database");
class TenantService extends BaseService_1.BaseService {
    constructor() {
        super(database_1.AppDataSource.getRepository(Tenant_1.Tenant));
        this.stripeService = new StripeService_1.StripeService();
    }
    async createTenant(data) {
        const existingTenant = await this.repository.findOne({
            where: { slug: data.slug },
        });
        if (existingTenant) {
            throw new errors_1.BadRequestError('Tenant slug already exists');
        }
        const tenant = await this.create({
            ...data,
            status: Tenant_1.TenantStatus.TRIAL,
            trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });
        try {
            const stripeCustomer = await this.stripeService.createCustomer({
                name: tenant.name,
                metadata: {
                    tenantId: tenant.id,
                },
            });
            await this.update(tenant.id, {
                stripeCustomerId: stripeCustomer.id,
            });
        }
        catch (error) {
            await this.delete(tenant.id);
            throw new errors_1.BadRequestError('Failed to create tenant in payment system');
        }
        return this.getTenantById(tenant.id);
    }
    async updateTenantStatus(id, status) {
        return this.update(id, { status });
    }
    async getTenantBySlug(slug) {
        const tenant = await this.repository.findOne({
            where: { slug },
        });
        if (!tenant)
            throw new errors_1.NotFoundError('Tenant not found');
        return tenant;
    }
    async getTenantUsage(tenantId) {
        return {
            userCount: 0,
            invoiceCount: 0,
            customerCount: 0,
        };
    }
    async getTenantById(id) {
        const tenant = await this.repository.findOne({
            where: { id },
        });
        if (!tenant)
            throw new errors_1.NotFoundError('Tenant not found');
        return tenant;
    }
    async updateTenant(id, updates) {
        await this.repository.update(id, updates);
        return this.getTenantById(id);
    }
}
exports.TenantService = TenantService;
//# sourceMappingURL=TenantService.js.map