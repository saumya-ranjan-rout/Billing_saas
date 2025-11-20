// packages/backend/src/routes/tenantRoutes.ts
import { Router } from 'express';
import { TenantController } from '../controllers/TenantController';
import { TenantService } from '../services/tenant/TenantService';
import { TenantProvisioningService } from '../services/tenant/TenantProvisioningService';
import { CacheService } from '../services/cache/CacheService';
import { authMiddleware } from '../middleware/auth';
import { tenantMiddleware } from '../middleware/tenant';
import { rbacMiddleware } from '../middleware/rbac';
import { validationMiddleware } from '../middleware/validation';
import { createTenantSchema, updateTenantSchema } from '../utils/validators';
import { cacheMiddleware } from '../middleware/cache';

const router = Router();

// Initialize services and controller
const tenantService = new TenantService();
const provisioningService = new TenantProvisioningService();
const cacheService = new CacheService();

// Pass all 3 services to controller
const tenantController = new TenantController(
  tenantService,
  provisioningService,
  cacheService
);

// ----------------- Public Route (no auth, no cache) -----------------
router.post(
  '/',
  validationMiddleware(createTenantSchema),
  tenantController.createTenant.bind(tenantController)
);

// ✅ Apply authentication and tenant middleware for all routes below
router.use(authMiddleware, tenantMiddleware);

// ----------------- Protected Routes -----------------
router.get(
  '/',
  rbacMiddleware(['read:tenant']),
  cacheMiddleware('5 minutes'), // tenant details rarely change
  tenantController.getTenantDetails.bind(tenantController)
);

router.put(
  '/',
  rbacMiddleware(['manage:tenant']),
  validationMiddleware(updateTenantSchema),
  tenantController.updateTenant.bind(tenantController)
);

export default router;



