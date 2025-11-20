"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requirePermission = exports.requireRole = exports.UserRole = void 0;
const ApplicationError_1 = require("../errors/ApplicationError");
var UserRole;
(function (UserRole) {
    UserRole["SUPER_ADMIN"] = "super_admin";
    UserRole["ADMIN"] = "admin";
    UserRole["USER"] = "user";
    UserRole["VIEWER"] = "viewer";
})(UserRole = exports.UserRole || (exports.UserRole = {}));
const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required.' });
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Insufficient permissions.' });
        }
        next();
    };
};
exports.requireRole = requireRole;
const requirePermission = (permissions) => {
    const permsArray = Array.isArray(permissions) ? permissions : [permissions];
    return (req, res, next) => {
        try {
            const user = req.user;
            if (!user) {
                throw new ApplicationError_1.AuthorizationError('Authentication required');
            }
            if (!user.permissions || !Array.isArray(user.permissions)) {
                throw new ApplicationError_1.AuthorizationError('User permissions not defined');
            }
            const hasPermission = permsArray.some((p) => user.permissions.includes(p));
            if (!hasPermission) {
                throw new ApplicationError_1.AuthorizationError('Insufficient permissions');
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.requirePermission = requirePermission;
//# sourceMappingURL=roles.js.map