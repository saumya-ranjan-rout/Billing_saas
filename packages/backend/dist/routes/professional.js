"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProfessionalController_1 = require("../controllers/ProfessionalController");
const GSTFilingController_1 = require("../controllers/GSTFilingController");
const auth_1 = require("../middleware/auth");
const professionalAuth_1 = require("../middleware/professionalAuth");
const cache_1 = require("../middleware/cache");
const router = (0, express_1.Router)();
router.post('/professionals/register', ProfessionalController_1.ProfessionalController.registerProfessional);
router.get('/professionals/dashboard', auth_1.authMiddleware, professionalAuth_1.professionalAuth, (0, cache_1.cacheMiddleware)('2m'), ProfessionalController_1.ProfessionalController.getDashboard);
router.get('/professionals/tenants', auth_1.authMiddleware, professionalAuth_1.professionalAuth, (0, cache_1.cacheMiddleware)('5m'), ProfessionalController_1.ProfessionalController.getManagedTenants);
router.post('/professionals/tenants/:tenantId', auth_1.authMiddleware, professionalAuth_1.professionalAuth, ProfessionalController_1.ProfessionalController.assignToTenant);
router.get('/gst/returns/:type', auth_1.authMiddleware, professionalAuth_1.professionalAuth, (0, cache_1.cacheMiddleware)('5m'), GSTFilingController_1.GSTFilingController.getReturn);
router.post('/gst/returns/:type/file', auth_1.authMiddleware, professionalAuth_1.professionalAuth, GSTFilingController_1.GSTFilingController.fileReturn);
router.get('/gst/filing-history', auth_1.authMiddleware, professionalAuth_1.professionalAuth, (0, cache_1.cacheMiddleware)('10m'), GSTFilingController_1.GSTFilingController.getFilingHistory);
router.get('/gst/compliance-calendar', auth_1.authMiddleware, professionalAuth_1.professionalAuth, (0, cache_1.cacheMiddleware)('30m'), GSTFilingController_1.GSTFilingController.getComplianceCalendar);
exports.default = router;
//# sourceMappingURL=professional.js.map