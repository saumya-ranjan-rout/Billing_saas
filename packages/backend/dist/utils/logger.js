"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorWithContext = exports.dbQueryLog = exports.apiLog = exports.auditLog = exports.stream = exports.userSchema = exports.customerSchema = exports.invoiceSchema = exports.validatePhone = exports.validateGSTIN = exports.validateEmail = void 0;
const joi_1 = __importDefault(require("joi"));
const constants_1 = require("./constants");
const winston_1 = __importDefault(require("winston"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const path_1 = __importDefault(require("path"));
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
exports.validateEmail = validateEmail;
const validateGSTIN = (gstin) => {
    const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
    if (!gstinRegex.test(gstin))
        return false;
    const stateCode = parseInt(gstin.substring(0, 2));
    return stateCode in constants_1.GST_STATES;
};
exports.validateGSTIN = validateGSTIN;
const validatePhone = (phone) => /^[6-9]\d{9}$/.test(phone.replace(/\D/g, ''));
exports.validatePhone = validatePhone;
exports.invoiceSchema = joi_1.default.object({
    customerId: joi_1.default.string().required(),
    issueDate: joi_1.default.date().required(),
    dueDate: joi_1.default.date().min(joi_1.default.ref('issueDate')).required(),
    items: joi_1.default.array().items(joi_1.default.object({
        description: joi_1.default.string().required(),
        quantity: joi_1.default.number().min(0.01).required(),
        unitPrice: joi_1.default.number().min(0).required(),
        taxRate: joi_1.default.number().min(0).max(100).required(),
    })).min(1).required(),
    notes: joi_1.default.string().allow('').optional(),
});
exports.customerSchema = joi_1.default.object({
    name: joi_1.default.string().min(2).max(100).required(),
    email: joi_1.default.string().email().required(),
    phone: joi_1.default.string().pattern(/^[6-9]\d{9}$/).optional(),
    address: joi_1.default.object({
        street: joi_1.default.string().required(),
        city: joi_1.default.string().required(),
        state: joi_1.default.string().valid(...Object.values(constants_1.GST_STATES)).required(),
        pincode: joi_1.default.string().pattern(/^\d{6}$/).required(),
        country: joi_1.default.string().default('India'),
    }).required(),
    gstin: joi_1.default.string().pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/).optional(),
});
exports.userSchema = joi_1.default.object({
    name: joi_1.default.string().min(2).max(100).required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(8).required(),
    role: joi_1.default.string().valid('admin', 'user', 'viewer').default('user'),
});
const logLevels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
    audit: 5,
};
const logColors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue',
    audit: 'cyan',
};
winston_1.default.addColors(logColors);
const logFormat = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }), winston_1.default.format.errors({ stack: true }), winston_1.default.format.json());
const consoleFormat = winston_1.default.format.combine(winston_1.default.format.colorize({ all: true }), winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }), winston_1.default.format.printf(({ timestamp, level, message, stack }) => `${timestamp} ${level}: ${message}${stack ? `\n${stack}` : ''}`));
const logsDir = path_1.default.join(process.cwd(), 'logs');
const buildTransports = () => [
    new winston_1.default.transports.Console({
        format: consoleFormat,
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    }),
    new winston_daily_rotate_file_1.default({
        filename: path_1.default.join(logsDir, 'error-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        level: 'error',
        maxSize: '20m',
        maxFiles: '14d',
        format: logFormat,
    }),
    new winston_daily_rotate_file_1.default({
        filename: path_1.default.join(logsDir, 'combined-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        maxSize: '20m',
        maxFiles: '14d',
        format: logFormat,
    }),
    new winston_daily_rotate_file_1.default({
        filename: path_1.default.join(logsDir, 'audit-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        level: 'audit',
        maxSize: '20m',
        maxFiles: '30d',
        format: logFormat,
    }),
];
const logger = winston_1.default.createLogger({
    levels: logLevels,
    level: process.env.LOG_LEVEL || 'info',
    transports: buildTransports(),
    defaultMeta: { service: 'billing-saas-api' },
    exitOnError: false,
});
exports.stream = {
    write: (message) => logger.http(message.trim()),
};
const auditLog = (message, meta) => logger.log('audit', message, meta);
exports.auditLog = auditLog;
const apiLog = (req, res, responseTime) => {
    const logData = {
        method: req.method,
        url: req.url,
        query: req.query,
        params: req.params,
        statusCode: res.statusCode,
        responseTime: `${responseTime}ms`,
        userAgent: req.get('User-Agent'),
        userId: req.user?.id || 'anonymous',
        tenantId: req.user?.tenantId || 'unknown',
    };
    res.statusCode >= 400
        ? logger.warn('API Request', logData)
        : logger.info('API Request', logData);
};
exports.apiLog = apiLog;
const dbQueryLog = (query, parameters = [], executionTime) => {
    logger.debug('Database Query', {
        query,
        parameters,
        executionTime: `${executionTime}ms`,
    });
};
exports.dbQueryLog = dbQueryLog;
const errorWithContext = (error, context = {}) => {
    logger.error(error.message, { stack: error.stack, ...context });
};
exports.errorWithContext = errorWithContext;
process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception', { message: error.message, stack: error.stack });
    if (process.env.NODE_ENV === 'production')
        process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection', { reason, promise });
    if (process.env.NODE_ENV === 'production')
        process.exit(1);
});
exports.default = logger;
//# sourceMappingURL=logger.js.map