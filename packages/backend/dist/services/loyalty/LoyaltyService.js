"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoyaltyService = void 0;
const database_1 = require("../../config/database");
const LoyaltyProgram_1 = require("../../entities/LoyaltyProgram");
const CustomerLoyalty_1 = require("../../entities/CustomerLoyalty");
const LoyaltyTransaction_1 = require("../../entities/LoyaltyTransaction");
const Customer_1 = require("../../entities/Customer");
const Invoice_1 = require("../../entities/Invoice");
const logger_1 = __importDefault(require("../../utils/logger"));
class LoyaltyService {
    constructor() {
        this.programRepository = database_1.AppDataSource.getRepository(LoyaltyProgram_1.LoyaltyProgram);
        this.customerLoyaltyRepository = database_1.AppDataSource.getRepository(CustomerLoyalty_1.CustomerLoyalty);
        this.transactionRepository = database_1.AppDataSource.getRepository(LoyaltyTransaction_1.LoyaltyTransaction);
        this.customerRepository = database_1.AppDataSource.getRepository(Customer_1.Customer);
        this.invoiceRepository = database_1.AppDataSource.getRepository(Invoice_1.Invoice);
    }
    safeNumber(value, defaultValue = 0) {
        if (value === null || value === undefined || value === '') {
            return defaultValue;
        }
        if (typeof value === 'string' && value.includes('.') && value.split('.').length > 2) {
            logger_1.default.warn(`Detected invalid numeric string: ${value}, using default: ${defaultValue}`);
            return defaultValue;
        }
        const num = Number(value);
        if (isNaN(num) || !isFinite(num)) {
            logger_1.default.warn(`Invalid number value: ${value}, using default: ${defaultValue}`);
            return defaultValue;
        }
        return num;
    }
    roundToTwoDecimals(value) {
        const num = this.safeNumber(value);
        return Math.round((num + Number.EPSILON) * 100) / 100;
    }
    safeAdd(a, b) {
        const numA = this.safeNumber(a);
        const numB = this.safeNumber(b);
        return this.roundToTwoDecimals(numA + numB);
    }
    async initializeDefaultProgram(tenantId) {
        const existingProgram = await this.programRepository.findOne({
            where: { tenantId, isDefault: true }
        });
        if (existingProgram) {
            return existingProgram;
        }
        const defaultProgram = this.programRepository.create({
            name: 'Default Cashback Program',
            description: '5% cashback on purchases above ₹10,000',
            rewardType: LoyaltyProgram_1.RewardType.CASHBACK,
            cashbackPercentage: 5.0,
            minimumPurchaseAmount: 10000.0,
            maximumCashbackAmount: 5000.0,
            eligibilityCriteria: { minimumOrderValue: 10000.0 },
            isDefault: true,
            tenantId
        });
        return await this.programRepository.save(defaultProgram);
    }
    async calculateCashback(tenantId, customerId, invoiceAmount) {
        try {
            const program = await this.programRepository.findOne({
                where: { tenantId, status: LoyaltyProgram_1.LoyaltyProgramStatus.ACTIVE }
            }) || await this.initializeDefaultProgram(tenantId);
            const safeInvoiceAmount = this.safeNumber(invoiceAmount);
            if (safeInvoiceAmount < program.minimumPurchaseAmount) {
                return { cashbackAmount: 0, percentage: 0 };
            }
            let cashbackAmount = (safeInvoiceAmount * program.cashbackPercentage) / 100;
            if (program.maximumCashbackAmount && cashbackAmount > program.maximumCashbackAmount) {
                cashbackAmount = program.maximumCashbackAmount;
            }
            const roundedCashback = this.roundToTwoDecimals(cashbackAmount);
            logger_1.default.info(`Cashback calculation: amount=${safeInvoiceAmount}, percentage=${program.cashbackPercentage}, cashback=${roundedCashback}`);
            return {
                cashbackAmount: roundedCashback,
                percentage: program.cashbackPercentage
            };
        }
        catch (error) {
            logger_1.default.error('Cashback calculation error:', error);
            return { cashbackAmount: 0, percentage: 0 };
        }
    }
    async processInvoiceForLoyalty(invoiceId) {
        const queryRunner = database_1.AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const check = await this.transactionRepository.findOne({
                where: { invoiceId },
            });
            if (check) {
                await queryRunner.release();
                return;
            }
            const invoice = await this.invoiceRepository.findOne({
                where: { id: invoiceId },
                relations: ['customer']
            });
            if (!invoice || !invoice.customer) {
                throw new Error('Invoice or customer not found');
            }
            logger_1.default.info(`Processing loyalty for invoice: ${invoiceId}, totalAmount: ${invoice.totalAmount}, type: ${typeof invoice.totalAmount}`);
            const { cashbackAmount, percentage } = await this.calculateCashback(invoice.tenantId, invoice.customer.id, invoice.totalAmount);
            if (cashbackAmount > 0) {
                const transaction = this.transactionRepository.create({
                    customerId: invoice.customer.id,
                    invoiceId: invoice.id,
                    type: LoyaltyTransaction_1.TransactionType.EARN,
                    status: LoyaltyTransaction_1.TransactionStatus.COMPLETED,
                    cashbackAmount: cashbackAmount,
                    orderAmount: this.safeNumber(invoice.totalAmount),
                    effectivePercentage: percentage,
                    description: `Cashback earned on invoice ${invoice.invoiceNumber}`,
                    tenantId: invoice.tenantId
                });
                await queryRunner.manager.save(transaction);
                let customerLoyalty = await this.customerLoyaltyRepository.findOne({
                    where: { customerId: invoice.customer.id, tenantId: invoice.tenantId }
                });
                if (!customerLoyalty) {
                    customerLoyalty = this.customerLoyaltyRepository.create({
                        customerId: invoice.customer.id,
                        tenantId: invoice.tenantId,
                        totalAmountSpent: 0,
                        totalOrders: 0,
                        availableCashback: 0,
                        totalCashbackEarned: 0,
                        currentTier: CustomerLoyalty_1.LoyaltyTier.BRONZE,
                        tierBenefits: {},
                        lastActivityDate: new Date()
                    });
                }
                const currentTotalSpent = this.safeNumber(customerLoyalty.totalAmountSpent);
                const currentTotalOrders = this.safeNumber(customerLoyalty.totalOrders);
                const currentAvailableCashback = this.safeNumber(customerLoyalty.availableCashback);
                const currentTotalCashbackEarned = this.safeNumber(customerLoyalty.totalCashbackEarned);
                customerLoyalty.totalAmountSpent = this.safeAdd(currentTotalSpent, invoice.totalAmount);
                customerLoyalty.totalOrders = currentTotalOrders + 1;
                customerLoyalty.availableCashback = this.safeAdd(currentAvailableCashback, cashbackAmount);
                customerLoyalty.totalCashbackEarned = this.safeAdd(currentTotalCashbackEarned, cashbackAmount);
                customerLoyalty.lastActivityDate = new Date();
                logger_1.default.info(`Customer loyalty update - totalSpent: ${customerLoyalty.totalAmountSpent}, availableCashback: ${customerLoyalty.availableCashback}, totalCashbackEarned: ${customerLoyalty.totalCashbackEarned}`);
                await this.updateCustomerTier(customerLoyalty);
                await queryRunner.manager.save(customerLoyalty);
                logger_1.default.info(`Processed cashback of ₹${cashbackAmount} for customer ${invoice.customer.id}`);
            }
            else {
                logger_1.default.info(`No cashback earned for invoice ${invoiceId} - amount below threshold`);
            }
            await queryRunner.commitTransaction();
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            logger_1.default.error('Invoice loyalty processing error:', error);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async updateCustomerTier(customerLoyalty) {
        const tiers = [
            { threshold: 50000, tier: CustomerLoyalty_1.LoyaltyTier.SILVER, benefits: { cashbackBonus: 1 } },
            { threshold: 100000, tier: CustomerLoyalty_1.LoyaltyTier.GOLD, benefits: { cashbackBonus: 2, prioritySupport: true } },
            { threshold: 250000, tier: CustomerLoyalty_1.LoyaltyTier.PLATINUM, benefits: { cashbackBonus: 3, dedicatedAccountManager: true } }
        ];
        let newTier = CustomerLoyalty_1.LoyaltyTier.BRONZE;
        let tierBenefits = {};
        const totalSpent = this.safeNumber(customerLoyalty.totalAmountSpent);
        for (const tier of tiers.reverse()) {
            if (totalSpent >= tier.threshold) {
                newTier = tier.tier;
                tierBenefits = tier.benefits;
                break;
            }
        }
        if (newTier !== customerLoyalty.currentTier) {
            customerLoyalty.currentTier = newTier;
            customerLoyalty.tierBenefits = tierBenefits;
            customerLoyalty.tierExpiryDate = new Date();
            customerLoyalty.tierExpiryDate.setFullYear(customerLoyalty.tierExpiryDate.getFullYear() + 1);
        }
    }
    async redeemCashback(tenantId, customerId, redeemAmount, invoiceId) {
        const queryRunner = database_1.AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const customerLoyalty = await this.customerLoyaltyRepository.findOne({
                where: { customerId, tenantId }
            });
            if (!customerLoyalty || customerLoyalty.availableCashback < redeemAmount) {
                throw new Error('Insufficient cashback balance');
            }
            const transaction = this.transactionRepository.create({
                customerId,
                invoiceId,
                type: LoyaltyTransaction_1.TransactionType.REDEEM,
                status: LoyaltyTransaction_1.TransactionStatus.COMPLETED,
                cashbackAmount: -redeemAmount,
                description: `Cashback redemption${invoiceId ? ` for invoice ${invoiceId}` : ''}`,
                tenantId
            });
            await queryRunner.manager.save(transaction);
            customerLoyalty.availableCashback = this.safeAdd(customerLoyalty.availableCashback, -redeemAmount);
            customerLoyalty.lastActivityDate = new Date();
            await queryRunner.manager.save(customerLoyalty);
            await queryRunner.commitTransaction();
            return transaction;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            logger_1.default.error('Cashback redemption error:', error);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async getCustomerLoyaltySummary(tenantId, customerId) {
        const customerLoyalty = await this.customerLoyaltyRepository.findOne({
            where: { customerId, tenantId }
        });
        const transactions = await this.transactionRepository.find({
            where: { customerId, tenantId },
            order: { createdAt: 'DESC' },
            take: 10
        });
        const program = await this.programRepository.findOne({
            where: { tenantId, status: LoyaltyProgram_1.LoyaltyProgramStatus.ACTIVE }
        });
        return {
            summary: customerLoyalty,
            recentTransactions: transactions,
            program: program
        };
    }
    async updateLoyaltyProgram(tenantId, programId, updates) {
        const program = await this.programRepository.findOne({
            where: { id: programId, tenantId }
        });
        if (!program) {
            throw new Error('Loyalty program not found');
        }
        Object.assign(program, updates);
        return await this.programRepository.save(program);
    }
    async getProgramStatistics(tenantId, programId) {
        const program = await this.programRepository.findOne({
            where: { id: programId, tenantId }
        });
        const totalCustomers = await this.customerLoyaltyRepository.count({
            where: { tenantId }
        });
        const totalCashback = await this.transactionRepository
            .createQueryBuilder('transaction')
            .select('SUM(transaction.cashbackAmount)', 'totalCashback')
            .where('transaction.tenantId = :tenantId', { tenantId })
            .andWhere('transaction.type = :type', { type: LoyaltyTransaction_1.TransactionType.EARN })
            .andWhere('transaction.status = :status', { status: LoyaltyTransaction_1.TransactionStatus.COMPLETED })
            .getRawOne();
        const redemptionRate = await this.transactionRepository
            .createQueryBuilder('transaction')
            .select('COUNT(DISTINCT transaction.customerId)', 'redeemingCustomers')
            .where('transaction.tenantId = :tenantId', { tenantId })
            .andWhere('transaction.type = :type', { type: LoyaltyTransaction_1.TransactionType.REDEEM })
            .getRawOne();
        return {
            program,
            statistics: {
                totalCustomers,
                totalCashback: this.safeNumber(totalCashback.totalCashback),
                redemptionRate: totalCustomers > 0 ? (redemptionRate.redeemingCustomers / totalCustomers) * 100 : 0
            }
        };
    }
    async getActiveProgram(tenantId) {
        let program = await this.programRepository.findOne({
            where: { tenantId, status: LoyaltyProgram_1.LoyaltyProgramStatus.ACTIVE }
        });
        if (!program) {
            program = await this.initializeDefaultProgram(tenantId);
        }
        return program;
    }
}
exports.LoyaltyService = LoyaltyService;
//# sourceMappingURL=LoyaltyService.js.map