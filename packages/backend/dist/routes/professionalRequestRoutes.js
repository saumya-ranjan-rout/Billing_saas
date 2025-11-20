"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProfessionalRequestController_1 = require("../controllers/ProfessionalRequestController");
const auth_1 = require("../middleware/auth");
const tenant_1 = require("../middleware/tenant");
const rbac_1 = require("../middleware/rbac");
const checkSubscription_1 = require("../middleware/checkSubscription");
const router = (0, express_1.Router)();
const controller = new ProfessionalRequestController_1.ProfessionalRequestController();
router.use(auth_1.authMiddleware, tenant_1.tenantMiddleware, checkSubscription_1.checkSubscription);
router.post("/", (0, rbac_1.rbacMiddleware)(['create:professional-requests']), (req, res) => controller.createRequest(req, res));
router.get("/", (0, rbac_1.rbacMiddleware)(['read:professional-requests']), (req, res) => controller.getRequests(req, res));
router.get("/professionals", (0, rbac_1.rbacMiddleware)(['read:professional-requests']), (req, res) => controller.getProfessionals(req, res));
router.patch("/:id/status", (0, rbac_1.rbacMiddleware)(['update:professional-requests']), (req, res) => controller.updateStatus(req, res));
exports.default = router;
//# sourceMappingURL=professionalRequestRoutes.js.map