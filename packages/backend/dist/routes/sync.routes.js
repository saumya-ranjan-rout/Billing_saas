"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sync_controller_1 = require("../controllers/sync.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const cache_1 = require("../middleware/cache");
const router = (0, express_1.Router)();
const syncController = new sync_controller_1.SyncController();
router.post('/data', auth_middleware_1.authenticateToken, syncController.syncData);
router.get('/updates', auth_middleware_1.authenticateToken, (0, cache_1.cacheMiddleware)('2 minutes'), syncController.getUpdates);
exports.default = router;
//# sourceMappingURL=sync.routes.js.map