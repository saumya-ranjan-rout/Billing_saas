"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionController = void 0;
class SubscriptionController {
    constructor(subscriptionService) {
        this.subscriptionService = subscriptionService;
    }
    async createSubscription(req, res) {
        try {
            const tenantId = req.user.tenantId;
            const { planId, paymentMethodId } = req.body;
            const subscription = await this.subscriptionService.createSubscription(tenantId, planId, paymentMethodId);
            res.status(201).json(subscription);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async cancelSubscription(req, res) {
        try {
            const tenantId = req.user.tenantId;
            const subscription = await this.subscriptionService.cancelSubscription(tenantId);
            res.json(subscription);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async getSubscription(req, res) {
        try {
            const tenantId = req.user.tenantId;
            const subscription = await this.subscriptionService.getSubscription(tenantId);
            res.json(subscription);
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
}
exports.SubscriptionController = SubscriptionController;
//# sourceMappingURL=SubscriptionController1.js.map