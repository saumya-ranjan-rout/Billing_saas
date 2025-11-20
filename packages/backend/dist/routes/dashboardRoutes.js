"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const InvoiceService_1 = require("../services/invoice/InvoiceService");
const CustomerService_1 = require("../services/customer/CustomerService");
const rbac_1 = require("../middleware/rbac");
const auth_1 = require("../middleware/auth");
const cache_1 = require("../middleware/cache");
const router = (0, express_1.Router)();
const invoiceService = new InvoiceService_1.InvoiceService();
const customerService = new CustomerService_1.CustomerService();
router.get("/", auth_1.authMiddleware, (0, rbac_1.rbacMiddleware)(["read:invoices", "read:customers"]), (0, cache_1.cacheMiddleware)("1 minute"), async (req, res) => {
    try {
        const user = req.user;
        const tenantId = user?.tenantId ?? user?.tenant?.id;
        if (!tenantId) {
            return res
                .status(401)
                .json({ message: "Unauthorized: tenantId missing" });
        }
        const invoicesResponse = await invoiceService.getInvoices(tenantId, {
            page: 1,
            limit: 1000,
        });
        const customersResponse = await customerService.getCustomers(tenantId, {
            page: 1,
            limit: 1000,
        });
        const invoices = invoicesResponse.data.map((inv) => {
            const issueDate = inv.issueDate ? new Date(inv.issueDate) : new Date();
            return {
                id: typeof inv.id === "string" ? parseInt(inv.id, 10) : inv.id,
                invoiceNumber: inv.invoiceNumber || "N/A",
                customerName: inv.customer?.name || "N/A",
                amount: Number(inv.totalAmount ?? 0),
                date: issueDate.toISOString(),
                status: inv.status || "unknown",
            };
        });
        const customers = customersResponse.data.map((cust) => {
            const joinedDate = cust.createdAt
                ? new Date(cust.createdAt)
                : new Date();
            return {
                id: typeof cust.id === "string" ? parseInt(cust.id, 10) : cust.id,
                name: cust.name || "N/A",
                email: cust.email || "N/A",
                joinedDate: joinedDate.toISOString(),
            };
        });
        const totalRevenue = invoices.reduce((sum, inv) => sum + inv.amount, 0);
        const totalCustomers = customers.length;
        const totalInvoices = invoices.length;
        const recentInvoices = invoices
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5);
        const recentCustomers = customers
            .sort((a, b) => new Date(b.joinedDate).getTime() -
            new Date(a.joinedDate).getTime())
            .slice(0, 5);
        const paidInvoices = invoices.filter(inv => inv.status === "paid").length;
        const pendingInvoices = invoices.filter(inv => inv.status === "draft").length;
        const newCustomers = customers.filter(cust => {
            const joinedDate = new Date(cust.joinedDate);
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return joinedDate >= thirtyDaysAgo;
        }).length;
        res.json({
            totalRevenue,
            totalCustomers,
            totalInvoices,
            paidInvoices,
            pendingInvoices,
            newCustomers,
            recentInvoices,
            recentCustomers,
        });
    }
    catch (err) {
        console.error("Dashboard error:", err);
        res
            .status(500)
            .json({ message: "Failed to load dashboard data", error: err });
    }
});
exports.default = router;
//# sourceMappingURL=dashboardRoutes.js.map