"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RBACService = void 0;
const User_1 = require("../../entities/User");
class RBACService {
    constructor() {
        this.rolePermissions = new Map();
        this.initializePermissions();
    }
    initializePermissions() {
        this.rolePermissions.set(User_1.UserRole.ADMIN, [
            { resource: '*', action: '*' },
        ]);
        this.rolePermissions.set(User_1.UserRole.FINANCE, [
            { resource: 'invoices', action: '*' },
            { resource: 'customers', action: 'read' },
            { resource: 'reports', action: '*' },
            { resource: 'products', action: 'read' },
        ]);
        this.rolePermissions.set(User_1.UserRole.SALES, [
            { resource: 'customers', action: '*' },
            { resource: 'invoices', action: 'create' },
            { resource: 'products', action: 'read' },
            { resource: 'quotes', action: '*' },
        ]);
        this.rolePermissions.set(User_1.UserRole.SUPPORT, [
            { resource: 'customers', action: 'read' },
            { resource: 'invoices', action: 'read' },
        ]);
        this.rolePermissions.set(User_1.UserRole.MEMBER, [
            { resource: 'profile', action: '*' },
            { resource: 'invoices', action: 'read' },
        ]);
    }
    hasPermission(role, resource, action) {
        const permissions = this.rolePermissions.get(role) || [];
        if (permissions.some(p => p.resource === '*' && p.action === '*')) {
            return true;
        }
        return permissions.some(p => (p.resource === resource || p.resource === '*') &&
            (p.action === action || p.action === '*'));
    }
    getPermissionsForRole(role) {
        return this.rolePermissions.get(role) || [];
    }
}
exports.RBACService = RBACService;
//# sourceMappingURL=RBACService.js.map