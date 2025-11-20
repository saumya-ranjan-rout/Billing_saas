"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueService = exports.JobType = void 0;
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
const ReportService_1 = require("../report/ReportService");
const InvoiceService_1 = require("../invoice/InvoiceService");
const logger_1 = __importDefault(require("../../utils/logger"));
var JobType;
(function (JobType) {
    JobType["GENERATE_REPORT"] = "generate_report";
    JobType["SEND_BULK_INVOICES"] = "send_bulk_invoices";
    JobType["SYNC_GST_DATA"] = "sync_gst_data";
    JobType["SEND_NOTIFICATION"] = "send_notification";
})(JobType = exports.JobType || (exports.JobType = {}));
class QueueService {
    constructor() {
        this.redis = new ioredis_1.default({
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379'),
            maxRetriesPerRequest: null
        });
        this.reportQueue = new bullmq_1.Queue(JobType.GENERATE_REPORT, { connection: this.redis });
        this.notificationQueue = new bullmq_1.Queue(JobType.SEND_NOTIFICATION, { connection: this.redis });
        this.reportService = new ReportService_1.ReportService();
        this.invoiceService = new InvoiceService_1.InvoiceService();
        this.setupWorkers();
    }
    setupWorkers() {
        new bullmq_1.Worker(JobType.GENERATE_REPORT, async (job) => {
            const { tenantId, reportType, format, filters, reportId } = job.data;
            try {
                const report = await this.reportService.generateReport(tenantId, reportType, format, filters);
                logger_1.default.info(`Report ${reportId} generated successfully`);
                return report;
            }
            catch (error) {
                logger_1.default.error(`Report generation failed for job ${job.id}:`, error);
                throw error;
            }
        }, { connection: this.redis });
        new bullmq_1.Worker(JobType.SEND_NOTIFICATION, async (job) => {
            const { type, userId, data } = job.data;
            try {
                await this.sendNotification(type, userId, data);
                logger_1.default.info(`Notification sent successfully for user ${userId}`);
            }
            catch (error) {
                logger_1.default.error(`Notification failed for job ${job.id}:`, error);
                throw error;
            }
        }, { connection: this.redis });
    }
    async queueReportGeneration(tenantId, reportType, format, filters, reportId) {
        return await this.reportQueue.add('generate', {
            tenantId,
            reportType,
            format,
            filters,
            reportId
        }, {
            removeOnComplete: 50,
            removeOnFail: 10,
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 5000
            }
        });
    }
    async queueNotification(type, userId, data) {
        return await this.notificationQueue.add('send', {
            type,
            userId,
            data
        }, {
            delay: 1000,
            attempts: 3
        });
    }
    async sendNotification(type, userId, data) {
        console.log(`Sending ${type} notification to user ${userId}`, data);
    }
}
exports.QueueService = QueueService;
//# sourceMappingURL=QueueService.js.map