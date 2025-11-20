import { Request, Response } from 'express';
import { SubscriptionService } from '../services/subscription/SubscriptionService';
import { ProfessionalService } from '../services/professional/ProfessionalService';
import { TenantService } from '../services/tenant/TenantService';

const subscriptionService = new SubscriptionService();
const professionalService = new ProfessionalService();
const tenantService = new TenantService();

export class ProfessionalOnboardingController {
  static async onboardTenant(req: Request, res: Response) {
    try {
      // const professionalId = req.professional.id;
      const professionalId = req.professional?.id;

if (!professionalId) {
  return res.status(401).json({ error: 'Unauthorized: Professional not found' });
}
      const { tenantData, planId, paymentMethodId } = req.body;

      const result = await subscriptionService.professionalOnboardsTenant(
        professionalId,
        tenantData,
        planId,
        paymentMethodId
      );

      // Assign professional to the tenant
      await professionalService.assignProfessionalToTenant(
        professionalId,
        result.tenant.id,
        {
          canFileGST: true,
          canManagePurchases: true,
          canApproveExpenses: true,
          canAccessReports: true
        }
      );

      res.status(201).json({
        message: 'Tenant onboarded successfully',
        tenant: result.tenant,
        subscription: result.subscription
      });
    } catch (error) {
      // res.status(500).json({ error: error.message });
      if (error instanceof Error) {
  return res.status(500).json({ error: error.message });
}

return res.status(500).json({ error: 'Unexpected error' });
    }
  }

  static async getProfessionalSubscriptions(req: Request, res: Response) {
    try {
  const professionalId = req.professional?.id;

if (!professionalId) {
  return res.status(401).json({ error: 'Unauthorized: Professional not found' });
}
      const subscriptions = await subscriptionService.getProfessionalSubscriptions(professionalId);
      
      res.json(subscriptions);
    } catch (error) {
      // res.status(500).json({ error: error.message });
      if (error instanceof Error) {
  return res.status(500).json({ error: error.message });
}

return res.status(500).json({ error: 'Unexpected error' });
    }
  }
}
