"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SettingController_1 = require("../controllers/SettingController");
const auth_1 = require("../middleware/auth");
const cache_1 = require("../middleware/cache");
const router = (0, express_1.Router)();
const controller = new SettingController_1.SettingController();
router.use(auth_1.authMiddleware);
router.get("/", (0, cache_1.cacheMiddleware)("10 minutes"), (req, res) => controller.get(req, res));
router.put("/", (req, res) => controller.update(req, res));
exports.default = router;
//# sourceMappingURL=settingRoutes.js.map