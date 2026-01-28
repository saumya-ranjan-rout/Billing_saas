"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerService = void 0;
const typeorm_1 = require("typeorm");
const database_1 = require("../../config/database");
const Customer_1 = require("../../entities/Customer");
const User_1 = require("../../entities/User");
const Subscription_1 = require("../../entities/Subscription");
const validators_1 = require("../../utils/validators");
const logger_1 = __importDefault(require("../../utils/logger"));
const Invoice_1 = require("../../entities/Invoice");
const PaymentInvoice_1 = require("../../entities/PaymentInvoice");
const CustomerLoyalty_1 = require("../../entities/CustomerLoyalty");
const LoyaltyTransaction_1 = require("../../entities/LoyaltyTransaction");
const LoyaltyService_1 = require("../loyalty/LoyaltyService");
const jwt = __importStar(require("jsonwebtoken"));
class CustomerService {
    constructor() {
        this.customerRepository = database_1.AppDataSource.getRepository(Customer_1.Customer);
        this.subscriptionRepository = database_1.AppDataSource.getRepository(Subscription_1.Subscription);
        this.userRepository = database_1.AppDataSource.getRepository(User_1.User);
        this.invoiceRepository = database_1.AppDataSource.getRepository(Invoice_1.Invoice);
        this.paymentRepository = database_1.AppDataSource.getRepository(PaymentInvoice_1.PaymentInvoice);
        this.customerLoyaltyRepository = database_1.AppDataSource.getRepository(CustomerLoyalty_1.CustomerLoyalty);
        this.transactionRepository = database_1.AppDataSource.getRepository(LoyaltyTransaction_1.LoyaltyTransaction);
        this.refreshTokens = new Set();
        this.loyaltyService = new LoyaltyService_1.LoyaltyService();
    }
    async getCustomerBalance(tenantId, customerId) {
        const totalDueResult = await this.invoiceRepository
            .createQueryBuilder("invoices")
            .select("SUM(invoices.totalAmount)", "totalDue")
            .where("invoices.tenantId = :tenantId", { tenantId })
            .andWhere("invoices.customerId = :customerId", { customerId })
            .getRawOne();
        const totalPaidResult = await this.paymentRepository
            .createQueryBuilder("payment_invoice")
            .select("SUM(payment_invoice.amount)", "totalPaid")
            .where("payment_invoice.tenantId = :tenantId", { tenantId })
            .andWhere("payment_invoice.customerId = :customerId", { customerId })
            .getRawOne();
        const totalRedeemedResult = await this.transactionRepository
            .createQueryBuilder("loyalty_transactions")
            .select("SUM(loyalty_transactions.cashbackAmount)", "totalredeemed")
            .where("loyalty_transactions.tenantId = :tenantId", { tenantId })
            .andWhere("loyalty_transactions.customerId = :customerId", { customerId })
            .andWhere("loyalty_transactions.type = :type", {
            type: LoyaltyTransaction_1.TransactionType.REDEEM,
        })
            .getRawOne();
        const totalDue = Number(totalDueResult?.totalDue ?? 0);
        const totalPaid = Number(totalPaidResult?.totalPaid ?? 0);
        const totalRedeemed = Number(totalRedeemedResult?.totalredeemed ?? 0);
        const balance = totalDue - totalPaid;
        return {
            customerId,
            totalDue,
            totalPaid,
            totalRedeemed,
            balance: totalDue - totalRedeemed - totalPaid
        };
    }
    async getCustomerPaymentHistory(tenantId, customerId) {
        const PaymentHistory = await this.paymentRepository.find({
            where: { tenantId, customerId, deletedAt: (0, typeorm_1.IsNull)() },
            order: { createdAt: 'DESC' },
        });
        return { PaymentHistory };
    }
    async createCustomer(tenantId, customerData) {
        try {
            if (customerData.gstin && !(0, validators_1.validateGSTIN)(customerData.gstin)) {
                throw new Error('Invalid GSTIN format');
            }
            if (customerData.phone && !/^[6-9]\d{9}$/.test(customerData.phone)) {
                throw new Error('Invalid phone number format');
            }
            const existingCustomeremail = await this.customerRepository.findOne({
                where: {
                    email: customerData.email,
                    tenantId,
                    deletedAt: (0, typeorm_1.IsNull)()
                }
            });
            if (existingCustomeremail) {
                throw new Error('Customer with this email already exists');
            }
            const existingCustomergstin = await this.customerRepository.findOne({
                where: {
                    gstin: customerData.gstin,
                    tenantId,
                    deletedAt: (0, typeorm_1.IsNull)()
                }
            });
            if (existingCustomergstin) {
                throw new Error('Customer with this gstin already exists');
            }
            const customer = this.customerRepository.create({
                ...customerData,
                tenantId
            });
            const savedCustomer = await this.customerRepository.save(customer);
            const completeCustomer = await this.customerRepository.findOne({
                where: { id: savedCustomer.id, deletedAt: (0, typeorm_1.IsNull)() },
                relations: ['tenant'],
            });
            if (!completeCustomer) {
                throw new Error('Failed to fetch created customer');
            }
            return completeCustomer;
        }
        catch (error) {
            logger_1.default.error('Error creating customer:', error);
            throw error;
        }
    }
    async getCustomer(tenantId, customerId) {
        try {
            const customer = await this.customerRepository.findOne({
                where: {
                    id: customerId,
                    tenantId,
                    deletedAt: (0, typeorm_1.IsNull)()
                },
                relations: ['tenant']
            });
            if (!customer) {
                throw new Error('Customer not found');
            }
            return customer;
        }
        catch (error) {
            logger_1.default.error('Error fetching customer:', error);
            throw error;
        }
    }
    async getCustomers(tenantId, options) {
        const today = new Date();
        try {
            const { page, limit, name, email, phone, status, joinedFrom, joinedTo } = options;
            const skip = (page - 1) * limit;
            const whereConditions = {
                tenantId,
                status: "Approved",
                deletedAt: (0, typeorm_1.IsNull)(),
            };
            if (options.name) {
                whereConditions.name = (0, typeorm_1.ILike)(`%${options.name}%`);
            }
            if (options.email) {
                whereConditions.email = (0, typeorm_1.ILike)(`%${options.email}%`);
            }
            if (options.phone) {
                whereConditions.phone = (0, typeorm_1.ILike)(`%${options.phone}%`);
            }
            if (joinedFrom && joinedTo) {
                const from = new Date(joinedFrom);
                const to = new Date(joinedTo);
                to.setHours(23, 59, 59, 999);
                whereConditions.createdAt = (0, typeorm_1.Between)(from, to);
            }
            else if (joinedFrom) {
                whereConditions.createdAt = (0, typeorm_1.MoreThanOrEqual)(new Date(joinedFrom));
            }
            else if (joinedTo) {
                const to = new Date(joinedTo);
                to.setHours(23, 59, 59, 999);
                whereConditions.createdAt = (0, typeorm_1.LessThanOrEqual)(to);
            }
            let [customers, total] = await this.customerRepository.findAndCount({
                where: whereConditions,
                relations: ["requestedBy", "requestedTo"],
                skip,
                take: limit,
                order: { createdAt: "DESC" },
            });
            for (const customer of customers) {
                const balance = await this.getCustomerBalance(tenantId, customer.id);
                const totalDueNum = Number(balance.totalDue ?? 0);
                const totalRedeemedNum = Number(balance.totalRedeemed ?? 0);
                const totalPaidNum = Number(balance.totalPaid ?? 0);
                const balanceNum = Number(balance.balance ?? 0);
                customer.totalDue = Number(totalDueNum.toFixed(2));
                customer.totalRedeemed = Number(totalRedeemedNum.toFixed(2));
                customer.totalPaid = Number(totalPaidNum.toFixed(2));
                customer.balance = Number(balanceNum.toFixed(2));
                if (balanceNum === 0 && totalDueNum > 0) {
                    customer.paymentStatus = PaymentInvoice_1.PaymentStatus.COMPLETED;
                }
                else if (totalPaidNum > 0 && balanceNum > 0) {
                    customer.paymentStatus = PaymentInvoice_1.PaymentStatus.PARTIAL;
                    ;
                }
                else {
                    customer.paymentStatus = PaymentInvoice_1.PaymentStatus.PENDING;
                }
                let tenantIdToCheck = null;
                let userstatus = null;
                if (customer.requestedBy && customer.requestedBy.role !== "professional") {
                    tenantIdToCheck = customer.requestedBy?.tenantId ?? null;
                    userstatus = customer.requestedBy?.status ?? null;
                }
                if (customer.requestedTo && customer.requestedTo.role !== "professional") {
                    tenantIdToCheck = customer.requestedTo?.tenantId ?? null;
                    userstatus = customer.requestedTo?.status ?? null;
                }
                let subs = 0;
                if (tenantIdToCheck) {
                    const [, count] = await this.subscriptionRepository.findAndCount({
                        where: {
                            tenantId: tenantIdToCheck,
                            status: (0, typeorm_1.In)(['active', 'trial']),
                            endDate: (0, typeorm_1.MoreThanOrEqual)(today),
                        },
                    });
                    subs = count;
                }
                customer.checkSubscription =
                    subs > 0 && userstatus === User_1.UserStatus.ACTIVE
                        ? "active"
                        : "inactive";
            }
            if (options.status) {
                customers = customers.filter(c => c.paymentStatus === options.status);
                total = customers.length;
            }
            return {
                data: customers,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit),
                },
            };
        }
        catch (error) {
            logger_1.default.error("Error fetching customers:", error);
            throw error;
        }
    }
    async updateCustomer(tenantId, customerId, updates) {
        try {
            if (updates.gstin && !(0, validators_1.validateGSTIN)(updates.gstin)) {
                throw new Error('Invalid GSTIN format');
            }
            const customer = await this.getCustomer(tenantId, customerId);
            if (updates.email && updates.email !== customer.email) {
                const existingCustomeremail = await this.customerRepository.findOne({
                    where: {
                        email: updates.email,
                        tenantId,
                        deletedAt: (0, typeorm_1.IsNull)()
                    }
                });
                if (existingCustomeremail && existingCustomeremail.id !== customerId) {
                    throw new Error('Customer with this email already exists');
                }
            }
            if (updates.gstin && updates.gstin !== customer.gstin) {
                const existingCustomergstin = await this.customerRepository.findOne({
                    where: {
                        gstin: updates.gstin,
                        tenantId,
                        deletedAt: (0, typeorm_1.IsNull)()
                    }
                });
                if (existingCustomergstin && existingCustomergstin.id !== customerId) {
                    throw new Error('Customer with this gstin already exists');
                }
            }
            Object.assign(customer, updates);
            await this.customerRepository.save(customer);
            const updatedCustomer = await this.customerRepository.findOne({
                where: { id: customerId, deletedAt: (0, typeorm_1.IsNull)() },
                relations: ['tenant']
            });
            if (!updatedCustomer) {
                throw new Error('Failed to fetch updated customer');
            }
            return updatedCustomer;
        }
        catch (error) {
            logger_1.default.error('Error updating customer:', error);
            throw error;
        }
    }
    async deleteCustomer(tenantId, customerId) {
        try {
            const customer = await this.getCustomer(tenantId, customerId);
            customer.deletedAt = new Date();
            await this.customerRepository.save(customer);
        }
        catch (error) {
            logger_1.default.error('Error deleting customer:', error);
            throw error;
        }
    }
    async searchCustomers(tenantId, query) {
        try {
            if (!query || query.length < 2) {
                throw new Error('Search query must be at least 2 characters long');
            }
            const customers = await this.customerRepository.find({
                where: [
                    {
                        tenantId,
                        name: (0, typeorm_1.ILike)(`%${query}%`),
                        deletedAt: (0, typeorm_1.IsNull)()
                    },
                    {
                        tenantId,
                        email: (0, typeorm_1.ILike)(`%${query}%`),
                        deletedAt: (0, typeorm_1.IsNull)()
                    },
                    {
                        tenantId,
                        phone: (0, typeorm_1.ILike)(`%${query}%`),
                        deletedAt: (0, typeorm_1.IsNull)()
                    },
                    {
                        tenantId,
                        gstin: (0, typeorm_1.ILike)(`%${query}%`),
                        deletedAt: (0, typeorm_1.IsNull)()
                    }
                ],
                take: 10
            });
            return customers;
        }
        catch (error) {
            logger_1.default.error('Error searching customers:', error);
            throw error;
        }
    }
    async getCustomerByGSTIN(tenantId, gstin) {
        try {
            const customer = await this.customerRepository.findOne({
                where: {
                    tenantId,
                    gstin,
                    deletedAt: (0, typeorm_1.IsNull)()
                }
            });
            return customer;
        }
        catch (error) {
            logger_1.default.error('Error fetching customer by GSTIN:', error);
            throw error;
        }
    }
    async getCustomersWithInvoices(tenantId, options) {
        const query = this.customerRepository.createQueryBuilder('customer')
            .leftJoinAndSelect('customer.invoices', 'invoice')
            .where('customer.tenantId = :tenantId', { tenantId })
            .andWhere('customer.deletedAt IS NULL');
        if (options.search) {
            query.andWhere('customer.name ILIKE :search OR customer.email ILIKE :search', {
                search: `%${options.search}%`
            });
        }
        query.skip((options.page - 1) * options.limit).take(options.limit);
        const [result, total] = await query.getManyAndCount();
        return {
            data: result,
            total,
            page: options.page,
            limit: options.limit,
        };
    }
    async updateUser(tenantId, loggedtenantId, loggedId) {
        try {
            const user = await this.userRepository.findOne({
                where: { id: loggedId, status: User_1.UserStatus.ACTIVE },
                relations: ['tenant']
            });
            if (!user)
                throw new Error('User not found');
            user.tenant = { id: tenantId };
            user.backupTenantId = loggedtenantId;
            user.role = User_1.UserRole.PROFESSIONAL_USER;
            await this.userRepository.save(user);
            const updated = await this.userRepository.findOne({
                where: { id: loggedId },
                relations: ['tenant']
            });
            if (!updated)
                throw new Error("User updated but cannot fetch again");
            return updated;
        }
        catch (error) {
            logger_1.default.error('Error updating user:', error);
            throw error;
        }
    }
    async switchTenant(payload) {
        const updatedPayload = {
            userId: payload.userId,
            tenantId: payload.tenantId,
            email: payload.email,
            role: payload.role,
            permissions: payload.permissions || [],
            firstName: payload.firstName,
            lastName: payload.lastName
        };
        const accessToken = this.generateToken(payload);
        const refreshToken = this.generateRefreshToken(payload);
        this.refreshTokens.add(refreshToken);
        const user = await database_1.AppDataSource.getRepository(User_1.User).findOne({
            where: { id: payload.userId }
        });
        if (!user) {
            throw new Error("User not found");
        }
        return { user: updatedPayload, accessToken, refreshToken };
    }
    generateToken(payload) {
        return jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || "1d",
        });
    }
    generateRefreshToken(payload) {
        return jwt.sign(payload, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
        });
    }
    async recordPayment(data) {
        const { invoiceId, amount, method, customerId, paymentDate, notes, status, paymentType, tenantId, cashBack } = data;
        if (cashBack > 0) {
            const customerLoyalty = await this.customerLoyaltyRepository.findOne({
                where: { customerId, tenantId }
            });
            if (!customerLoyalty || customerLoyalty.availableCashback < cashBack) {
                throw new Error('Insufficient cashback balance');
            }
            const transaction = this.transactionRepository.create({
                customerId,
                invoiceId,
                type: LoyaltyTransaction_1.TransactionType.REDEEM,
                status: LoyaltyTransaction_1.TransactionStatus.COMPLETED,
                cashbackAmount: -cashBack,
                description: `Cashback redemption for invoice ${invoiceId}`,
                tenantId
            });
            await this.transactionRepository.save(transaction);
            customerLoyalty.availableCashback -= cashBack;
            customerLoyalty.lastActivityDate = new Date();
            await this.customerLoyaltyRepository.save(customerLoyalty);
        }
        await this.loyaltyService.processCustomerForLoyalty(amount, customerId, tenantId);
        const payment = this.paymentRepository.create({
            invoiceId,
            amount,
            method,
            customerId,
            paymentDate,
            notes,
            status,
            paymentType,
            tenantId,
            createdAt: new Date(),
        });
        return await this.paymentRepository.save(payment);
    }
}
exports.CustomerService = CustomerService;
//# sourceMappingURL=CustomerService.js.map