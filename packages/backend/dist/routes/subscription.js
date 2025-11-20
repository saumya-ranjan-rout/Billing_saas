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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SubscriptionController_1 = require("../controllers/SubscriptionController");
const auth_1 = require("../middleware/auth");
const tenant_1 = require("../middleware/tenant");
const router = (0, express_1.Router)();
const subscriptionController = new SubscriptionController_1.SubscriptionController();
router.get('/plans/init', async (req, res) => {
    const subscriptionService = new (await Promise.resolve().then(() => __importStar(require('../services/subscription/SubscriptionService')))).SubscriptionService();
    await subscriptionService.initializeDefaultPlans();
    res.json({ message: 'Default plans initialized' });
});
router.get('/plans', subscriptionController.getPlans.bind(subscriptionController));
router.get('/current', auth_1.authMiddleware, subscriptionController.getCurrentSubscription.bind(subscriptionController));
router.get('/check-access', auth_1.authMiddleware, subscriptionController.checkAccess.bind(subscriptionController));
router.get('/stats', auth_1.authMiddleware, tenant_1.tenantMiddleware, subscriptionController.getStats.bind(subscriptionController));
router.post('/subscribe', auth_1.authMiddleware, subscriptionController.createSubscription.bind(subscriptionController));
router.post('/payment/success', auth_1.authMiddleware, subscriptionController.handlePaymentSuccess.bind(subscriptionController));
router.post('/payment/failure', auth_1.authMiddleware, subscriptionController.handlePaymentFailure.bind(subscriptionController));
router.post('/cancel', auth_1.authMiddleware, subscriptionController.cancelSubscription.bind(subscriptionController));
exports.default = router;
//# sourceMappingURL=subscription.js.map