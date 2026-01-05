import { Router } from "express";
import { InvoiceService } from "../services/invoice/InvoiceService";
import { CustomerService } from "../services/customer/CustomerService";
import { rbacMiddleware } from "../middleware/rbac";
import { authMiddleware } from "../middleware/auth";
import { cacheMiddleware } from "../middleware/cache";
import { Invoice as InvoiceEntity } from "../entities/Invoice";
import { Customer as CustomerEntity } from "../entities/Customer";
import { AppDataSource } from '../config/database';
import { PaymentInvoice, PaymentType, PaymentStatus } from "../entities/PaymentInvoice";


const router = Router();

// Services
const invoiceService = new InvoiceService();
const customerService = new CustomerService();

// Dashboard types
interface DashboardInvoice {
  id: number;
  invoiceNumber: string;
  customerName: string;
  amount: number;
  date: string;
  status: string;
}

interface DashboardCustomer {
  id: number;
  name: string;
  email: string;
  joinedDate: string;
}

router.get(
  "/",
  authMiddleware,
  rbacMiddleware(["read:invoices", "read:customers"]),
  cacheMiddleware("1 minute"), // ✅ Cache for 1 minute
  async (req, res) => {
    // console.log("user:",req.user);
    try {
      const user = (req as any).user;
      const tenantId = user?.tenantId ?? user?.tenant?.id;

      if (!tenantId) {
        return res
          .status(401)
          .json({ message: "Unauthorized: tenantId missing" });
      }

      // Fetch invoices and customers
      const invoicesResponse = await invoiceService.getInvoices(tenantId, {
        page: 1,
        limit: 1000,
      });
      const customersResponse = await customerService.getCustomers(tenantId, {
        page: 1,
        limit: 1000,
      });

      // Map invoices safely
      const invoices: DashboardInvoice[] = invoicesResponse.data.map(
        (inv: InvoiceEntity) => {
          const issueDate = inv.issueDate ? new Date(inv.issueDate) : new Date();
          return {
            id: typeof inv.id === "string" ? parseInt(inv.id, 10) : inv.id,
            invoiceNumber: inv.invoiceNumber || "N/A",
            customerName: inv.customer?.name || "N/A",
            amount: Number(inv.totalAmount ?? 0),
            date: issueDate.toISOString(),
            status: inv.status || "unknown",
          };
        }
      );

      // Map customers safely
      const customers: DashboardCustomer[] = customersResponse.data.map(
        (cust: CustomerEntity) => {
          const joinedDate = cust.createdAt
            ? new Date(cust.createdAt)
            : new Date();
          return {
            id: typeof cust.id === "string" ? parseInt(cust.id, 10) : cust.id,
            name: cust.name || "N/A",
            email: cust.email || "N/A",
            joinedDate: joinedDate.toISOString(),
          };
        }
      );

      // Totals
      const totalRevenue = invoices.reduce((sum, inv) => sum + inv.amount, 0);
      const totalCustomers = customers.length;
      const totalInvoices = invoices.length;

      // Recent items
      const recentInvoices = invoices
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

      const recentCustomers = customers
        .sort(
          (a, b) =>
            new Date(b.joinedDate).getTime() -
            new Date(a.joinedDate).getTime()
        )
        .slice(0, 5);

      const paidInvoices = invoices.filter(inv => inv.status === "paid").length;
      const pendingInvoices = invoices.filter(inv => inv.status === "draft").length;

      // New customers (joined in last 30 days)
      const newCustomers = customers.filter(cust => {
        const joinedDate = new Date(cust.joinedDate);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return joinedDate >= thirtyDaysAgo;
      }).length;

      // 12-12-2025
      const paymentRepo = AppDataSource.getRepository(PaymentInvoice);

      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      // Today Income
      const incomeTodayRaw = await paymentRepo
        .createQueryBuilder("p")
        .select("SUM(p.amount)", "total")
        .where("p.tenantId = :tenantId", { tenantId })
        .andWhere("p.status != :pending", { pending: PaymentStatus.PENDING })
        .andWhere("p.paymentType = :type", { type: PaymentType.INCOME })
        .andWhere("p.paymentDate BETWEEN :start AND :end", {
          start: todayStart,
          end: todayEnd,
        })
        .getRawOne();

      const todayIncome = Number(incomeTodayRaw?.total ?? 0);

      // Today Expense
      const expenseTodayRaw = await paymentRepo
        .createQueryBuilder("p")
        .select("SUM(p.amount)", "total")
        .where("p.tenantId = :tenantId", { tenantId })
        .andWhere("p.status != :pending", { pending: PaymentStatus.PENDING })
        .andWhere("p.paymentType = :type", { type: PaymentType.EXPENSE })
        .andWhere("p.paymentDate BETWEEN :start AND :end", {
          start: todayStart,
          end: todayEnd,
        })
        .getRawOne();

      const todayExpense = Number(expenseTodayRaw?.total ?? 0);

      // TODAY INVOICE TOTAL AMOUNT (from invoices table)
      const invoiceRepo = AppDataSource.getRepository(InvoiceEntity);

      const todayInvoiceTotalRaw = await invoiceRepo
        .createQueryBuilder("inv")
        .select("SUM(inv.totalAmount)", "total")
        .where("inv.tenantId = :tenantId", { tenantId })
        .andWhere("inv.createdAt BETWEEN :start AND :end", {
          start: todayStart,
          end: todayEnd,
        })
        .getRawOne();

      const todayInvoiceTotalAmount = Number(todayInvoiceTotalRaw?.total ?? 0);

      const todayDue = todayInvoiceTotalAmount - todayIncome;


      // Final response
      res.json({
        totalRevenue,
        totalCustomers,
        totalInvoices,
        paidInvoices,
        pendingInvoices,
        newCustomers,
        recentInvoices,
        recentCustomers,

        todayIncome,
        todayExpense,
        todayDue,
      });
    } catch (err) {
      console.error("Dashboard error:", err);
      res
        .status(500)
        .json({ message: "Failed to load dashboard data", error: err });
    }
  }
);

export default router;



