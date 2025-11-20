"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TenantController_1 = require("../controllers/TenantController");
const AuthController_1 = require("../controllers/AuthController");
const auth_1 = require("../middleware/auth");
const tenant_1 = require("../middleware/tenant");
const validation_1 = require("../middleware/validation");
const validators_1 = require("../utils/validators");
const TenantService_1 = require("../services/tenant/TenantService");
const TenantProvisioningService_1 = require("../services/tenant/TenantProvisioningService");
const AuthService_1 = require("../services/auth/AuthService");
const CacheService_1 = require("../services/cache/CacheService");
const cache_1 = require("../middleware/cache");
const validateLicense_1 = __importDefault(require("../middleware/validateLicense"));
const router = (0, express_1.Router)();
const tenantService = new TenantService_1.TenantService();
const provisioningService = new TenantProvisioningService_1.TenantProvisioningService();
const authService = new AuthService_1.AuthService();
const cacheService = new CacheService_1.CacheService();
const tenantController = new TenantController_1.TenantController(tenantService, provisioningService, cacheService);
const authController = new AuthController_1.AuthController(authService);
router.post('/login', authController.login.bind(authController));
router.post('/super-user-login', authController.superUserlogin.bind(authController));
router.post('/enable-biometric', auth_1.authMiddleware, authController.enableBiometric.bind(authController));
router.post('/biometric/enable', auth_1.authMiddleware, authController.enableBiometric.bind(authController));
router.post('/register', authController.registerWithTenant.bind(authController));
router.use("/validate-license", validateLicense_1.default);
router.get('/all-tenants', (0, cache_1.cacheMiddleware)('5 minutes'), authController.getTenants.bind(authController));
router.get('/tenants/:email', (0, cache_1.cacheMiddleware)('2m'), authController.getTenantsForUser.bind(authController));
router.get('/me', auth_1.authMiddleware, (req, res) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    res.json({ success: true, user: req.user });
});
router.get('/mewithtenant', auth_1.authMiddleware, authController.meWithTenant.bind(authController));
router.post('/', (0, validation_1.validationMiddleware)(validators_1.createTenantSchema), tenantController.createTenant.bind(tenantController));
router.get('/', auth_1.authMiddleware, tenant_1.tenantMiddleware, (0, cache_1.cacheMiddleware)('3m'), tenantController.getTenantDetails.bind(tenantController));
router.put('/', auth_1.authMiddleware, tenant_1.tenantMiddleware, (0, validation_1.validationMiddleware)(validators_1.updateTenantSchema), tenantController.updateTenant.bind(tenantController));
exports.default = router;
//# sourceMappingURL=authRoutes.js.map