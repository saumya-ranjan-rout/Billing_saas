"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const Tenant_1 = require("../entities/Tenant");
const database_1 = require("../config/database");
class AuthController {
    constructor(authService, tenantRepo = database_1.AppDataSource.getRepository(Tenant_1.Tenant)) {
        this.authService = authService;
        this.tenantRepo = tenantRepo;
        this.enableBiometric = async (req, res) => {
            try {
                const userId = req.user.id;
                await this.authService.enableBiometric(userId);
                res.json({ success: true, message: 'Biometric authentication enabled' });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to enable biometric authentication',
                });
            }
        };
        this.getTenantsForUser = async (req, res) => {
            try {
                const { email } = req.params;
                const tenants = await this.authService.getTenantsForUser(email);
                res.json({ success: true, tenants });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to fetch tenants',
                });
            }
        };
        this.getTenants = async (req, res) => {
            try {
                const tenants = await this.authService.getTenants();
                res.json(tenants);
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to fetch tenants',
                });
            }
        };
    }
    async registerWithTenant(req, res) {
        try {
            const { businessName, subdomain, slug, firstName, lastName, email, password, accountType, professionType, licenseNo, pan, gst } = req.body;
            const newUser = await this.authService.registerWithTenant({
                businessName,
                subdomain,
                slug,
                firstName,
                lastName,
                email,
                password,
                accountType,
                professionType,
                licenseNo,
                pan,
                gst
            });
            res.status(201).json({
                success: true,
                message: "Tenant and user created successfully",
                user: newUser,
            });
        }
        catch (error) {
            console.error("Error in register controller:", error);
            res.status(500).json({
                success: false,
                message: error.message || "Registration failed",
            });
        }
    }
    async meWithTenant(req, res) {
        try {
            const userData = req.user;
            if (!userData) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const tenant = await this.tenantRepo.findOne({
                where: { id: userData.tenantId }
            });
            if (!tenant) {
                return res.status(404).json({ message: "Tenant not found" });
            }
            res.json({ success: true, user: userData, tenant });
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const result = await this.authService.login(email, password);
            res.json({
                success: true,
                user: result.user,
                accessToken: result.accessToken,
                refreshToken: result.refreshToken,
                check_subscription: result.check_subscription
            });
        }
        catch (error) {
            console.error('Login error:', error.message);
            res.status(401).json({ error: error.message });
        }
    }
    async superUserlogin(req, res) {
        try {
            const { tenant, email, password } = req.body;
            const result = await this.authService.superUserlogin(tenant, email, password);
            res.json({
                success: true,
                user: result.user,
                accessToken: result.accessToken,
                refreshToken: result.refreshToken,
            });
        }
        catch (error) {
            console.error('Login error:', error.message);
            res.status(401).json({ error: error.message });
        }
    }
    async register(req, res) {
        try {
            const { email, password, tenantId } = req.body;
            const user = await this.authService.register({ email, password }, tenantId);
            res.status(201).json(user);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async refreshToken(req, res) {
        try {
            const { refreshToken } = req.body;
            const tokens = await this.authService.refreshToken(refreshToken);
            res.json(tokens);
        }
        catch (error) {
            res.status(401).json({ error: error.message });
        }
    }
    async logout(req, res) {
        try {
            const { refreshToken } = req.body;
            await this.authService.logout(refreshToken);
            res.status(204).send();
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map