"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfessionalOnboardingController = void 0;
const SubscriptionService_1 = require("../services/subscription/SubscriptionService");
const ProfessionalService_1 = require("../services/professional/ProfessionalService");
const TenantService_1 = require("../services/tenant/TenantService");
const subscriptionService = new SubscriptionService_1.SubscriptionService();
const professionalService = new ProfessionalService_1.ProfessionalService();
const tenantService = new TenantService_1.TenantService();
class ProfessionalOnboardingController {
    static async onboardTenant(req, res) {
        try {
            const professionalId = req.professional?.id;
            if (!professionalId) {
                return res.status(401).json({ error: 'Unauthorized: Professional not found' });
            }
            const { tenantData, planId, paymentMethodId } = req.body;
            const result = await subscriptionService.professionalOnboardsTenant(professionalId, tenantData, planId, paymentMethodId);
            await professionalService.assignProfessionalToTenant(professionalId, result.tenant.id, {
                canFileGST: true,
                canManagePurchases: true,
                canApproveExpenses: true,
                canAccessReports: true
            });
            res.status(201).json({
                message: 'Tenant onboarded successfully',
                tenant: result.tenant,
                subscription: result.subscription
            });
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({ error: error.message });
            }
            return res.status(500).json({ error: 'Unexpected error' });
        }
    }
    static async getProfessionalSubscriptions(req, res) {
        try {
            const professionalId = req.professional?.id;
            if (!professionalId) {
                return res.status(401).json({ error: 'Unauthorized: Professional not found' });
            }
            const subscriptions = await subscriptionService.getProfessionalSubscriptions(professionalId);
            res.json(subscriptions);
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({ error: error.message });
            }
            return res.status(500).json({ error: 'Unexpected error' });
        }
    }
}
exports.ProfessionalOnboardingController = ProfessionalOnboardingController;
//# sourceMappingURL=ProfessionalOnboardingController.js.map