"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantOnboardingController = void 0;
const SubscriptionService_1 = require("../services/subscription/SubscriptionService");
const TenantService_1 = require("../services/tenant/TenantService");
const subscriptionService = new SubscriptionService_1.SubscriptionService();
const tenantService = new TenantService_1.TenantService();
class TenantOnboardingController {
    static async createTenantWithSubscription(req, res) {
        try {
            const { tenantData, planId, paymentMethodId, professionalId } = req.body;
            const tenant = await tenantService.createTenant(tenantData);
            const subscription = await subscriptionService.subscribeTenant(tenant.id, planId, paymentMethodId, professionalId);
            if (professionalId) {
            }
            res.status(201).json({
                message: 'Tenant created and subscribed successfully',
                tenant,
                subscription
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: 'An unknown error occurred' });
            }
        }
    }
    static async getSubscriptionPlans(req, res) {
        try {
            const plans = await subscriptionService.getSubscriptionPlans();
            res.json(plans);
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: 'An unknown error occurred' });
            }
        }
    }
}
exports.TenantOnboardingController = TenantOnboardingController;
//# sourceMappingURL=TenantOnboardingController.js.map