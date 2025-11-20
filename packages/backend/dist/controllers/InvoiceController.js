"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceController = void 0;
const express_validator_1 = require("express-validator");
const logger_1 = __importDefault(require("../utils/logger"));
const response_1 = require("../utils/response");
function getErrorMessage(error) {
    return error instanceof Error ? error.message : String(error);
}
class InvoiceController {
    constructor(invoiceService, settingService, cacheService, queueService, loyaltyService) {
        this.invoiceService = invoiceService;
        this.settingService = settingService;
        this.cacheService = cacheService;
        this.queueService = queueService;
        this.loyaltyService = loyaltyService;
        this.getSalesReport = async (req, res) => {
            try {
                if (!req.user)
                    return res.status(401).json({ error: "Unauthorized" });
                const tenantId = req.user.tenantId;
                const { startDate, endDate } = req.query;
                const report = await this.invoiceService.getSalesReport(tenantId, {
                    startDate: startDate,
                    endDate: endDate,
                });
                res.json(report);
            }
            catch (err) {
                res.status(500).json({ message: "Error fetching Sales Report", error: err });
            }
        };
        this.getGSTR1Report = async (req, res) => {
            try {
                if (!req.user)
                    return res.status(401).json({ error: "Unauthorized" });
                const tenantId = req.user.tenantId;
                const { startDate, endDate } = req.query;
                const report = await this.invoiceService.getGSTR1Report(tenantId, {
                    startDate: startDate,
                    endDate: endDate,
                });
                res.json(report);
            }
            catch (err) {
                res.status(500).json({ message: "Error fetching GSTR-1 Report", error: err });
            }
        };
        this.getInvoicePDF = async (req, res) => {
            try {
                if (!req.user)
                    return res.status(401).json({ error: "Unauthorized" });
                const tenantId = req.user.tenantId;
                const [invoice, setting] = await Promise.all([
                    this.invoiceService.getInvoice(tenantId, req.params.id),
                    this.settingService.getByTenant(tenantId)
                ]);
                if (!invoice)
                    return res.status(404).json({ error: "Invoice not found" });
                if (!setting)
                    return res.status(404).json({ error: "Tenant settings not found" });
                const pdfBuffer = await this.invoiceService.generateInvoicePDF(invoice, setting);
                res.setHeader("Content-Type", "application/pdf");
                res.setHeader("Content-Disposition", `inline; filename=invoice-${invoice.invoiceNumber}.pdf`);
                return res.send(pdfBuffer);
            }
            catch (error) {
                logger_1.default.error("Error generating invoice PDF", error);
                return res.status(500).json({ error: "Failed to generate invoice PDF ❌" });
            }
        };
    }
    async list(req, res) {
        try {
            const tenantId = req.tenantId;
            const { cursor, limit = 20, search, status, customerId, startDate, endDate, pagination = 'keyset' } = req.query;
            let result;
            if (pagination === 'keyset') {
                result = await this.invoiceService.getInvoicesWithKeysetPagination(tenantId, {
                    cursor: cursor,
                    limit: Number(limit),
                    search: search,
                    status: status,
                    customerId: customerId,
                    startDate: startDate ? new Date(startDate) : undefined,
                    endDate: endDate ? new Date(endDate) : undefined,
                });
            }
            else {
                const { page = 1 } = req.query;
                result = await this.invoiceService.getInvoicesForListView(tenantId, {
                    page: Number(page),
                    limit: Number(limit),
                    search: search,
                    status: status,
                    customerId: customerId,
                });
            }
            return (0, response_1.ok)(res, result);
        }
        catch (error) {
            logger_1.default.error('Error fetching invoices:', error);
            return (0, response_1.errorResponse)(res, 'Failed to fetch invoices');
        }
    }
    async get(req, res) {
        try {
            const tenantId = req.tenantId;
            const { id } = req.params;
            const invoice = await this.invoiceService.getInvoiceWithDetails(tenantId, id);
            return (0, response_1.ok)(res, invoice);
        }
        catch (error) {
            logger_1.default.error('Error fetching invoice:', error);
            return (0, response_1.errorResponse)(res, 'Failed to fetch invoice');
        }
    }
    async createInvoice(req, res) {
        const startTime = Date.now();
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty())
                return res.status(400).json({ errors: errors.array() });
            if (!req.user)
                return res.status(401).json({ error: 'Unauthorized' });
            const tenantId = req.user.tenantId;
            const invoiceData = req.body;
            const customerName = invoiceData.customerName;
            const customerEmail = invoiceData.customerEmail;
            let customerIdToUse = invoiceData.customerId;
            if (customerEmail) {
                const customer = await this.invoiceService.getOrCreateCustomerByEmail(tenantId, customerName, customerEmail);
                customerIdToUse = customer.id;
            }
            const payloadForService = { ...invoiceData, customerId: customerIdToUse };
            delete payloadForService.customerName;
            delete payloadForService.customerEmail;
            if (payloadForService.items?.length > 100) {
                return res.status(400).json({ error: 'Cannot create invoice with more than 100 items' });
            }
            const invoice = await this.invoiceService.createInvoice(tenantId, payloadForService);
            await Promise.all([
                this.cacheService.del(`invoices:${tenantId}:*`),
                this.cacheService.invalidatePattern(`invoices:${tenantId}:*`),
                this.cacheService.invalidatePattern(`cache:${tenantId}:/api/invoices*`),
                this.cacheService.invalidatePattern(`*Invoice*${tenantId}*`)
            ]);
            this.queueService
                .queueNotification('invoice_created', req.user.id, {
                invoiceId: invoice.id,
                invoiceNumber: invoice.invoiceNumber,
                amount: invoice.totalAmount
            })
                .catch(err => logger_1.default.error('Failed to queue invoice_created notification', err));
            await this.loyaltyService.processInvoiceForLoyalty(invoice.id);
            logger_1.default.info(`Invoice created in ${Date.now() - startTime}ms`, { invoiceId: invoice.id, tenantId });
            res.status(201).json(invoice);
        }
        catch (error) {
            logger_1.default.error('Error creating invoice:', error);
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }
    async updateInvoice(req, res) {
        const startTime = Date.now();
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty())
                return res.status(400).json({ errors: errors.array() });
            if (!req.user)
                return res.status(401).json({ error: 'Unauthorized' });
            const { id } = req.params;
            const tenantId = req.user.tenantId;
            const updates = req.body;
            let customerIdToUse = updates.customerId;
            if (updates.customerEmail || updates.customerName) {
                const customer = await this.invoiceService.getOrCreateCustomerByEmail(tenantId, updates.customerName, updates.customerEmail);
                customerIdToUse = customer.id;
            }
            const payloadForUpdate = { ...updates, customerId: customerIdToUse };
            delete payloadForUpdate.customerName;
            delete payloadForUpdate.customerEmail;
            const invoice = await this.invoiceService.updateInvoice(tenantId, id, payloadForUpdate);
            await Promise.all([
                this.cacheService.del(`invoices:${tenantId}:${id}`),
                this.cacheService.invalidatePattern(`invoices:${tenantId}:*`),
                this.cacheService.invalidatePattern(`cache:${tenantId}:/api/invoices*`),
                this.cacheService.invalidatePattern(`*Invoice*${tenantId}*`)
            ]);
            await this.loyaltyService.processInvoiceForLoyalty(invoice.id);
            logger_1.default.info(`Invoice updated in ${Date.now() - startTime}ms`, { id, tenantId });
            res.json(invoice);
        }
        catch (error) {
            logger_1.default.error('Error updating invoice:', error);
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }
    async getInvoice(req, res) {
        const startTime = Date.now();
        try {
            if (!req.user)
                return res.status(401).json({ error: 'Unauthorized' });
            const { id } = req.params;
            const tenantId = req.user.tenantId;
            const cacheKey = `invoice:${id}:${tenantId}`;
            const invoice = await this.cacheService.getOrSet(cacheKey, () => this.invoiceService.getInvoice(tenantId, id), 300);
            if (!invoice)
                return res.status(404).json({ error: 'Invoice not found' });
            logger_1.default.debug(`Invoice fetched in ${Date.now() - startTime}ms`, { id, tenantId });
            res.json(invoice);
        }
        catch (error) {
            logger_1.default.error('Error fetching invoice:', error);
            res.status(404).json({ error: getErrorMessage(error) });
        }
    }
    async getInvoices(req, res) {
        const startTime = Date.now();
        try {
            if (!req.user)
                return res.status(401).json({ error: 'Unauthorized' });
            const tenantId = req.user.tenantId;
            const { page = 1, limit = 10, search, status, type, customerId, startDate, endDate } = req.query;
            const pageNum = Math.max(1, parseInt(page));
            const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
            const options = {
                page: pageNum,
                limit: limitNum,
                search: search,
                status: status,
                type: type ? type : undefined,
                customerId: customerId,
                startDate: startDate ? new Date(startDate) : undefined,
                endDate: endDate ? new Date(endDate) : undefined
            };
            const cacheKey = `invoices:${tenantId}:${JSON.stringify(options)}`;
            const invoices = await this.cacheService.getOrSet(cacheKey, () => this.invoiceService.getInvoices(tenantId, options), 60);
            logger_1.default.debug(`Invoices fetched in ${Date.now() - startTime}ms`, { tenantId, page: pageNum, limit: limitNum });
            res.json(invoices);
        }
        catch (error) {
            logger_1.default.error('Error fetching invoices:', error);
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }
    async updateInvoiceStatus(req, res) {
        try {
            if (!req.user)
                return res.status(401).json({ error: 'Unauthorized' });
            const { id } = req.params;
            const { status } = req.body;
            const tenantId = req.user.tenantId;
            const invoice = await this.invoiceService.updateInvoiceStatus(tenantId, id, status);
            res.json(invoice);
        }
        catch (error) {
            logger_1.default.error('Error updating invoice status:', error);
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }
    async addPayment(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty())
                return res.status(400).json({ errors: errors.array() });
            if (!req.user)
                return res.status(401).json({ error: 'Unauthorized' });
            const tenantId = req.user.tenantId;
            const payment = await this.invoiceService.addPayment(tenantId, req.body);
            res.status(201).json(payment);
        }
        catch (error) {
            logger_1.default.error('Error adding payment:', error);
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }
    async deleteInvoice(req, res) {
        const startTime = Date.now();
        try {
            if (!req.user)
                return res.status(401).json({ error: 'Unauthorized' });
            const { id } = req.params;
            const tenantId = req.user.tenantId;
            await this.invoiceService.deleteInvoice(tenantId, id);
            await Promise.all([
                this.cacheService.del(`invoices:${tenantId}:${id}`),
                this.cacheService.invalidatePattern(`invoices:${tenantId}:*`),
                this.cacheService.invalidatePattern(`cache:${tenantId}:/api/invoices*`),
                this.cacheService.invalidatePattern(`*Invoice*${tenantId}*`)
            ]);
            logger_1.default.info(`Invoice deleted in ${Date.now() - startTime}ms`, { id, tenantId });
            res.status(204).send();
        }
        catch (error) {
            logger_1.default.error('Error deleting invoice:', error);
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }
    async bulkCreateInvoices(req, res) {
        try {
            if (!req.user)
                return res.status(401).json({ error: 'Unauthorized' });
            const tenantId = req.user.tenantId;
            const { invoices } = req.body;
            if (!invoices || invoices.length > 50) {
                return res.status(400).json({ error: 'Cannot process more than 50 invoices in bulk' });
            }
            const createdInvoices = await this.invoiceService.bulkCreateInvoices(tenantId, invoices);
            await Promise.all([
                this.cacheService.invalidatePattern(`invoices:${tenantId}:*`),
                this.cacheService.invalidatePattern(`dashboard:${tenantId}`)
            ]);
            res.status(201).json(createdInvoices);
        }
        catch (error) {
            logger_1.default.error('Error bulk creating invoices:', error);
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }
    async getCustomerInvoices(req, res) {
        try {
            if (!req.user)
                return res.status(401).json({ error: 'Unauthorized' });
            const { customerId } = req.params;
            const tenantId = req.user.tenantId;
            const invoices = await this.invoiceService.getCustomerInvoices(tenantId, customerId);
            res.json(invoices);
        }
        catch (error) {
            logger_1.default.error('Error fetching customer invoices:', error);
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }
    async getOverdueInvoices(req, res) {
        try {
            if (!req.user)
                return res.status(401).json({ error: 'Unauthorized' });
            const tenantId = req.user.tenantId;
            const cacheKey = `invoices:overdue:${tenantId}`;
            const invoices = await this.cacheService.getOrSet(cacheKey, () => this.invoiceService.getOverdueInvoices(tenantId), 300);
            res.json(invoices);
        }
        catch (error) {
            logger_1.default.error('Error fetching overdue invoices:', error);
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }
    async getInvoiceSummary(req, res) {
        try {
            if (!req.user)
                return res.status(401).json({ error: 'Unauthorized' });
            const tenantId = req.user.tenantId;
            const summary = await this.invoiceService.getInvoiceSummary(tenantId);
            res.json(summary);
        }
        catch (error) {
            logger_1.default.error('Error fetching invoice summary:', error);
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }
    async sendInvoice(req, res) {
        try {
            if (!req.user)
                return res.status(401).json({ error: 'Unauthorized' });
            const { id } = req.params;
            const tenantId = req.user.tenantId;
            const invoice = await this.invoiceService.sendInvoice(tenantId, id);
            this.queueService
                .queueNotification('invoice_sent', req.user.id, {
                invoiceId: invoice.id,
                invoiceNumber: invoice.invoiceNumber,
                customer: invoice.customer?.name
            })
                .catch(err => logger_1.default.error('Failed to queue invoice_sent notification', err));
            res.json(invoice);
        }
        catch (error) {
            logger_1.default.error('Error sending invoice:', error);
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }
}
exports.InvoiceController = InvoiceController;
//# sourceMappingURL=InvoiceController.js.map