"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tenantRoutes_1 = __importDefault(require("./tenantRoutes"));
const authRoutes_1 = __importDefault(require("./authRoutes"));
const invoiceRoutes_1 = __importDefault(require("./invoiceRoutes"));
const subscriptionRoutes_1 = __importDefault(require("./subscriptionRoutes"));
const reportRoutes_1 = __importDefault(require("./reportRoutes"));
const customerRoutes_1 = __importDefault(require("./customerRoutes"));
const router = (0, express_1.Router)();
router.use('/api/v1/tenants', tenantRoutes_1.default);
router.use('/api/v1/auth', authRoutes_1.default);
router.use('/api/v1/invoices', invoiceRoutes_1.default);
router.use('/api/v1/subscriptions', subscriptionRoutes_1.default);
router.use('/api/v1/reports', reportRoutes_1.default);
router.use('/api/v1/customers', customerRoutes_1.default);
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});
router.use('/api/*', (req, res) => {
    res.status(404).json({ error: 'API endpoint not found' });
});
exports.default = router;
//# sourceMappingURL=index.js.map