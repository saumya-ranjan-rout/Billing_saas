"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TenantOnboardingController_1 = require("../controllers/TenantOnboardingController");
const ProfessionalOnboardingController_1 = require("../controllers/ProfessionalOnboardingController");
const auth_1 = require("../middleware/auth");
const professionalAuth_1 = require("../middleware/professionalAuth");
const cache_1 = require("../middleware/cache");
const router = (0, express_1.Router)();
router.get('/subscription-plans', (0, cache_1.cacheMiddleware)('5m'), TenantOnboardingController_1.TenantOnboardingController.getSubscriptionPlans);
router.post('/tenant', TenantOnboardingController_1.TenantOnboardingController.createTenantWithSubscription);
router.post('/professional/onboard-tenant', auth_1.authMiddleware, professionalAuth_1.professionalAuth, ProfessionalOnboardingController_1.ProfessionalOnboardingController.onboardTenant);
router.get('/professional/subscriptions', auth_1.authMiddleware, professionalAuth_1.professionalAuth, (0, cache_1.cacheMiddleware)('2m'), ProfessionalOnboardingController_1.ProfessionalOnboardingController.getProfessionalSubscriptions);
exports.default = router;
//# sourceMappingURL=onboarding.js.map