import { User } from './User';
import { Invoice } from './Invoice';
import { Subscription } from './Subscription';
import { GSTIN } from './GSTIN';
import { SyncLog } from './SyncLog';
import { Client } from './Client';
import { Product } from './Product';
import { HSN } from './HSN';
import { BaseEntity } from './BaseEntity';
import { TaxRate } from './TaxRate';
import { ProfessionalUser } from './ProfessionalUser';
import { PurchaseOrder } from './PurchaseOrder';
import { Vendor } from './Vendor';
import { Category } from './Category';
import { PaymentInvoice } from './PaymentInvoice';
import { Report } from './Report';
import { Expense } from './Expense';
import { LoyaltyProgram } from './LoyaltyProgram';
export declare enum TenantStatus {
    ACTIVE = "active",
    SUSPENDED = "suspended",
    TRIAL = "trial",
    TRIAL_EXPIRED = "trial_expired"
}
export declare class Tenant extends BaseEntity {
    name: string;
    businessName: string;
    subdomain?: string;
    slug: string;
    status: TenantStatus;
    trialEndsAt: Date;
    stripeCustomerId: string;
    isActive: boolean;
    accountType?: string;
    professionType?: string;
    licenseNo?: string;
    pan?: string;
    gst?: string;
    users: User[];
    invoices: Invoice[];
    subscriptions: Subscription[];
    gstins: GSTIN[];
    clients: Client[];
    syncLogs: SyncLog[];
    categories: Category[];
    products: Product[];
    hsnCodes: HSN[];
    taxRates: TaxRate[];
    professionals: ProfessionalUser[];
    purchaseOrders: PurchaseOrder[];
    vendors: Vendor[];
    payments: PaymentInvoice[];
    reports: Report[];
    expenses: Expense[];
    loyaltyPrograms: LoyaltyProgram[];
}
//# sourceMappingURL=Tenant.d.ts.map