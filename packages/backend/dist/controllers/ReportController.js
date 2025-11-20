"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportController = exports.getErrorMessage = void 0;
const Report_1 = require("../entities/Report");
const logger_1 = __importDefault(require("../utils/logger"));
function getErrorMessage(error) {
    if (error instanceof Error)
        return error.message;
    return String(error);
}
exports.getErrorMessage = getErrorMessage;
class ReportController {
    constructor(reportService, queueService, cacheService) {
        this.reportService = reportService;
        this.queueService = queueService;
        this.cacheService = cacheService;
    }
    async generateReport(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const { type, format, filters } = req.body;
            const tenantId = req.user.tenantId;
            const report = await this.reportService.generateReport(tenantId, type, format, filters);
            res.json(report);
        }
        catch (error) {
            logger_1.default.error('Error generating report:', error);
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }
    async getReportStatus(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const { id } = req.params;
            const tenantId = req.user.tenantId;
            const cacheKey = `report:status:${id}`;
            const cachedStatus = await this.cacheService.get(cacheKey);
            if (cachedStatus) {
                return res.json(cachedStatus);
            }
            const report = await this.reportService.getReportById(tenantId, id);
            if (!report) {
                return res.status(404).json({ error: 'Report not found' });
            }
            const status = {
                id: report.id,
                status: report.status,
                progress: report.status === Report_1.ReportStatus.GENERATING ? '50%' : '100%',
                downloadUrl: report.status === Report_1.ReportStatus.COMPLETED ?
                    `/api/reports/${id}/download` : null,
                error: report.errorMessage,
                generatedAt: report.generatedAt
            };
            await this.cacheService.set(cacheKey, status, 30);
            res.json(status);
        }
        catch (error) {
            logger_1.default.error('Error fetching report status:', error);
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }
    async downloadReport(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const { id } = req.params;
            const tenantId = req.user.tenantId;
            const report = await this.reportService.getReportById(tenantId, id);
            if (!report) {
                return res.status(404).json({ error: 'Report not found' });
            }
            if (!report.filePath) {
                return res.status(400).json({ error: 'Report file not available' });
            }
            res.setHeader('Content-Type', this.getContentType(report.format));
            res.setHeader('Content-Disposition', `attachment; filename="${report.name}.${report.format}"`);
            const fs = require('fs');
            const fileStream = fs.createReadStream(report.filePath);
            fileStream.pipe(res);
            fileStream.on('error', (error) => {
                logger_1.default.error('Error streaming report file:', error);
                res.status(500).json({ error: 'Failed to download report' });
            });
        }
        catch (error) {
            logger_1.default.error('Error downloading report:', error);
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }
    getContentType(format) {
        const contentTypes = {
            pdf: 'application/pdf',
            excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            csv: 'text/csv',
            json: 'application/json'
        };
        return contentTypes[format] || 'application/octet-stream';
    }
    async getReportHistory(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const tenantId = req.user.tenantId;
            const { page = 1, limit = 10 } = req.query;
            const cacheKey = `reports:history:${tenantId}:${page}:${limit}`;
            const history = await this.cacheService.getOrSet(cacheKey, async () => {
                return await this.reportService.getReportHistory(tenantId, parseInt(page), parseInt(limit));
            }, 60);
            res.json(history);
        }
        catch (error) {
            logger_1.default.error('Error fetching report history:', error);
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }
    async getReportById(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const { id } = req.params;
            const tenantId = req.user.tenantId;
            const report = await this.reportService.getReportById(tenantId, id);
            if (!report) {
                return res.status(404).json({ error: 'Report not found' });
            }
            res.json(report);
        }
        catch (error) {
            logger_1.default.error('Error fetching report:', error);
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }
    async getReportData(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const { id } = req.params;
            const tenantId = req.user.tenantId;
            const report = await this.reportService.getReportById(tenantId, id);
            if (!report) {
                return res.status(404).json({ error: 'Report not found' });
            }
            if (report.status !== 'completed') {
                return res.status(400).json({ error: 'Report not ready for preview' });
            }
            const reportData = await this.reportService.getReportData(report);
            res.json(reportData);
        }
        catch (error) {
            logger_1.default.error('Error fetching report data:', error);
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }
    async deleteReport(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const { id } = req.params;
            const tenantId = req.user.tenantId;
            await this.reportService.deleteReport(tenantId, id);
            res.json({
                message: 'Report deleted successfully',
                reportId: id
            });
        }
        catch (error) {
            logger_1.default.error('Error deleting report:', error);
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }
    async generateGSTR1(req, res) {
        await this.generateSpecificReport(req, res, Report_1.ReportType.GSTR1_OUTWARD_SUPPLIES);
    }
    async generateGSTR3B(req, res) {
        await this.generateSpecificReport(req, res, Report_1.ReportType.GSTR3B_SUMMARY);
    }
    async generateSalesRegister(req, res) {
        await this.generateSpecificReport(req, res, Report_1.ReportType.SALES_REGISTER);
    }
    async generatePurchaseRegister(req, res) {
        await this.generateSpecificReport(req, res, Report_1.ReportType.PURCHASE_REGISTER);
    }
    async generateHSNSummary(req, res) {
        await this.generateSpecificReport(req, res, Report_1.ReportType.HSN_SUMMARY);
    }
    async generateTDSReport(req, res) {
        await this.generateSpecificReport(req, res, Report_1.ReportType.TDS_REPORT);
    }
    async generateAuditTrail(req, res) {
        await this.generateSpecificReport(req, res, Report_1.ReportType.AUDIT_TRAIL);
    }
    async generateProfitLoss(req, res) {
        await this.generateSpecificReport(req, res, Report_1.ReportType.PROFIT_LOSS);
    }
    async generateBalanceSheet(req, res) {
        await this.generateSpecificReport(req, res, Report_1.ReportType.BALANCE_SHEET);
    }
    async generateCashBankBook(req, res) {
        await this.generateSpecificReport(req, res, Report_1.ReportType.CASH_BANK_BOOK);
    }
    async generateLedgerReport(req, res) {
        await this.generateSpecificReport(req, res, Report_1.ReportType.LEDGER_REPORT);
    }
    async generateSpecificReport(req, res, reportType) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const { format, filters } = req.body;
            const tenantId = req.user.tenantId;
            const report = await this.reportService.generateReport(tenantId, reportType, format, filters);
            res.json(report);
        }
        catch (error) {
            logger_1.default.error(`Error generating ${reportType} report:`, error);
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }
}
exports.ReportController = ReportController;
//# sourceMappingURL=ReportController.js.map