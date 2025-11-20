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
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const cluster_1 = __importDefault(require("cluster"));
const os_1 = __importDefault(require("os"));
const database_1 = require("./config/database");
const error_middleware_1 = require("./middleware/error.middleware");
const tenant_middleware_1 = require("./middleware/tenant.middleware");
const logger_1 = __importStar(require("./utils/logger"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../../.env') });
class ApplicationServer {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = parseInt(process.env.PORT || '3000');
        this.setupMiddleware();
        this.setupRoutes();
        this.setupErrorHandling();
    }
    setupMiddleware() {
        this.app.set('trust proxy', true);
        this.app.use((0, cors_1.default)({
            origin: process.env.NODE_ENV === 'production'
                ? ['https://yourdomain.com', 'https://www.yourdomain.com']
                : ['http://192.168.29.17:3000', 'http://192.168.29.17:3001'],
            credentials: true
        }));
        this.app.use(express_1.default.json({ limit: '10mb' }));
        this.app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
        this.app.use((0, morgan_1.default)('combined', { stream: logger_1.stream }));
        this.app.use(tenant_middleware_1.extractTenantFromSubdomain);
    }
    setupRoutes() {
        this.app.get('/health', (req, res) => {
            res.json({
                status: 'OK',
                timestamp: new Date().toISOString(),
                service: 'Billing SaaS API',
                version: process.env.npm_package_version || '1.0.0'
            });
        });
        this.app.get('/metrics', (req, res) => {
            res.json({
                uptime: process.uptime(),
                memory: process.memoryUsage(),
                pid: process.pid,
                version: process.version,
            });
        });
        this.app.use('/api/dashboard', require('./routes/dashboardRoutes').default);
        this.app.use('/api/auth', require('./routes/authRoutes').default);
        this.app.use('/api/notifications', require('./routes/notification.routes').default);
        this.app.use('/api/sync', require('./routes/sync.routes').default);
        this.app.use('/api/invoices', require('./routes/invoiceRoutes').default);
        this.app.use('/api/customers', require('./routes/customerRoutes').default);
        this.app.use('/api/products', require('./routes/productRoutes').default);
        this.app.use('/api/vendors', require('./routes/vendorRoutes').default);
        this.app.use('/api/purchases', require('./routes/purchaseRoutes').default);
        this.app.use('/api/settings', require('./routes/settingRoutes').default);
        this.app.use('/api/reports', require('./routes/reportRoutes').default);
        this.app.use('/api/loyalty', require('./routes/loyaltyRoutes').default);
        this.app.use('/api/users', require('./routes/userRoutes').default);
        this.app.use('/api/subscriptions', require('./routes/subscriptionRoutes').default);
        this.app.use('/api/super-admin', require('./routes/super-admin').default);
        this.app.use('/api/professional-requests', require('./routes/professionalRequestRoutes').default);
    }
    setupErrorHandling() {
        this.app.use('*', (req, res) => {
            logger_1.default.warn('Route not found', {
                path: req.originalUrl,
                method: req.method,
                ip: req.ip
            });
            res.status(404).json({
                success: false,
                message: 'Route not found'
            });
        });
        this.app.use(error_middleware_1.errorHandler);
    }
    async start() {
        try {
            await (0, database_1.initializeDatabase)();
            logger_1.default.info('Database connected successfully');
            this.app.listen(this.port, () => {
                logger_1.default.info(`Server running on port ${this.port} in ${process.env.NODE_ENV || 'development'} mode`);
            });
        }
        catch (error) {
            logger_1.default.error('Failed to start server', {
                error: error?.message,
                stack: error?.stack
            });
            process.exit(1);
        }
    }
    getApp() {
        return this.app;
    }
}
if (cluster_1.default.isPrimary && process.env.NODE_ENV === 'production') {
    const numCPUs = os_1.default.cpus().length;
    logger_1.default.info(`Master ${process.pid} running with ${numCPUs} workers`);
    for (let i = 0; i < numCPUs; i++) {
        cluster_1.default.fork();
    }
    cluster_1.default.on('exit', (worker) => {
        logger_1.default.warn(`Worker ${worker.process.pid} died. Restarting...`);
        cluster_1.default.fork();
    });
}
else {
    const server = new ApplicationServer();
    server.start().catch((error) => {
        logger_1.default.error('Worker failed to start', { error: error.message, stack: error.stack });
        process.exit(1);
    });
}
exports.default = ApplicationServer;
//# sourceMappingURL=app.js.map