"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfessionalRequestService = void 0;
const typeorm_1 = require("typeorm");
const database_1 = require("../../config/database");
const Customer_1 = require("../../entities/Customer");
const Tenant_1 = require("../../entities/Tenant");
const User_1 = require("../../entities/User");
const Subscription_1 = require("../../entities/Subscription");
const CacheService_1 = require("../../services/cache/CacheService");
class ProfessionalRequestService {
    constructor() {
        this.customerRepo = database_1.AppDataSource.getRepository(Customer_1.Customer);
        this.tenantRepo = database_1.AppDataSource.getRepository(Tenant_1.Tenant);
        this.userRepo = database_1.AppDataSource.getRepository(User_1.User);
        this.subscriptionRepo = database_1.AppDataSource.getRepository(Subscription_1.Subscription);
        this.cacheService = new CacheService_1.CacheService();
    }
    async createRequest(user, requestedId, message) {
        const existingRequest1 = await this.customerRepo.findOne({
            where: {
                requestedBy: { id: user.id },
                requestedTo: { id: requestedId },
            },
        });
        const existingRequest2 = await this.customerRepo.findOne({
            where: {
                requestedBy: { id: requestedId },
                requestedTo: { id: user.id },
            },
        });
        if (existingRequest1 || existingRequest2) {
            throw new Error("Request already exists between these users");
        }
        let newCustomer;
        if (user.role === User_1.UserRole.PROFESSIONAL) {
            const requestedUser = await this.userRepo.findOne({ where: { id: requestedId } });
            if (!requestedUser)
                throw new Error("Requested professional not found");
            const requestedTenant = await this.tenantRepo.findOne({ where: { id: requestedUser.tenantId } });
            if (!requestedTenant)
                throw new Error("Requested user's tenant not found");
            const requesterTenant = await this.tenantRepo.findOne({ where: { id: user.tenantId } });
            if (!requesterTenant)
                throw new Error("Requester tenant not found");
            newCustomer = this.customerRepo.create({
                name: requestedTenant.name,
                email: requestedUser.email,
                phone: null,
                type: Customer_1.CustomerType.BUSINESS,
                tenant: requesterTenant,
                metadata: { requestedBy: user.id, requestedId, message },
                isActive: true,
                creditBalance: 0,
                gstin: requestedTenant.gst || null,
                pan: requestedTenant.pan || null,
                billingAddress: null,
                shippingAddress: null,
                status: "Pending",
                requestedBy: user.id,
                requestedTo: requestedId,
            });
        }
        else {
            const requesterTenant = await this.tenantRepo.findOne({ where: { id: user.tenantId } });
            if (!requesterTenant)
                throw new Error("Requester tenant not found");
            const requestedUser = await this.userRepo.findOne({ where: { id: requestedId } });
            if (!requestedUser)
                throw new Error("Requested user not found");
            const requestedTenant = await this.tenantRepo.findOne({ where: { id: requestedUser.tenantId } });
            if (!requestedTenant)
                throw new Error("Requested user's tenant not found");
            newCustomer = this.customerRepo.create({
                name: requesterTenant.name,
                email: user.email,
                phone: user.phone || null,
                type: Customer_1.CustomerType.BUSINESS,
                tenant: requestedTenant,
                metadata: { requestedBy: user.id, requestedId, message },
                isActive: true,
                creditBalance: 0,
                gstin: requesterTenant.gst || null,
                pan: requesterTenant.pan || null,
                billingAddress: null,
                shippingAddress: null,
                status: "Pending",
                requestedBy: { id: user.id },
                requestedTo: { id: requestedId },
            });
        }
        await Promise.all([
            this.cacheService.invalidatePattern(`customers:${user.tenantId}:*`),
            this.cacheService.invalidatePattern(`cache:${user.tenantId}:/api/customers*`),
            this.cacheService.invalidatePattern(`dashboard:${user.tenantId}`)
        ]);
        return await this.customerRepo.save(newCustomer);
    }
    async getRequests(user) {
        return this.customerRepo.find({
            where: [
                { status: (0, typeorm_1.In)(["Pending", "Rejected", "Approved"]), requestedBy: { id: user.id } },
                { status: (0, typeorm_1.In)(["Pending", "Rejected", "Approved"]), requestedTo: { id: user.id } },
            ],
            relations: ["requestedBy", "requestedTo"],
            order: { createdAt: "DESC" },
        });
    }
    async getProfessionals(user) {
        const today = new Date();
        if (user.role === User_1.UserRole.PROFESSIONAL) {
            const today = new Date();
            const tenants = await this.tenantRepo
                .createQueryBuilder("tenant")
                .innerJoin("tenant.subscriptions", "subscription", "subscription.endDate > :today", { today })
                .where("(tenant.accountType IS NULL OR tenant.accountType != :accountType)", {
                accountType: "professional",
            })
                .orderBy("tenant.name", "ASC")
                .getMany();
            const result = [];
            for (const tenant of tenants) {
                const user = await this.userRepo
                    .createQueryBuilder("u")
                    .where("u.tenantId = :tenantId", { tenantId: tenant.id })
                    .andWhere("u.role = :adminRole", { adminRole: User_1.UserRole.ADMIN })
                    .andWhere("u.status = :status", { status: "active" })
                    .orderBy("u.createdAt", "ASC")
                    .getOne();
                if (user) {
                    result.push({
                        tenantId: tenant.id,
                        tenantName: tenant.name,
                        id: user?.id || null,
                        firstName: user?.firstName || null,
                        lastName: user?.lastName || null,
                        email: user?.email || null,
                    });
                }
            }
            return result;
        }
        else {
            const professionals = await this.userRepo
                .createQueryBuilder("user")
                .leftJoinAndSelect("user.tenant", "tenant")
                .leftJoinAndSelect("tenant.subscriptions", "subscription")
                .where("user.role = :role", { role: User_1.UserRole.PROFESSIONAL })
                .andWhere("subscription.endDate > :today", { today })
                .orderBy("user.firstName", "ASC")
                .getMany();
            return professionals.map((p) => ({
                id: p.id,
                firstName: p.firstName,
                lastName: p.lastName,
                email: p.email,
                tenantId: p.tenant?.id,
                tenantName: p.tenant?.name,
            }));
        }
    }
    async updateStatus(customerId, status) {
        const customer = await this.customerRepo.findOne({ where: { id: customerId } });
        if (!customer)
            throw new Error("Customer not found");
        customer.status = status;
        return await this.customerRepo.save(customer);
    }
}
exports.ProfessionalRequestService = ProfessionalRequestService;
//# sourceMappingURL=ProfessionalRequestService.js.map