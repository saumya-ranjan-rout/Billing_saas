import { Tenant } from "./Tenant";
export declare class Client {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    taxId?: string;
    tenant: Tenant;
    createdAt: Date;
    updatedAt: Date;
}
export declare class GSTIN {
    id: number;
    gstin: string;
    legalname: string;
    tradename: string;
    address: any;
    statecode: string;
    isactive: boolean;
    isprimary: boolean;
    authstatus?: any;
    tenant: Tenant;
    createdAt: Date;
    updatedAt: Date;
}
export declare class HsnCode {
    id: number;
    code: string;
    description: string;
    gstrate: number;
    cessrate?: number;
    isactive: boolean;
    tenant: Tenant;
    createdat: Date;
    updatedat: Date;
}
export declare class Product {
    id: number;
    name: string;
    description?: string;
    type: string;
    price: number;
    currency: string;
    isactive: boolean;
    sku?: string;
    metadata?: any;
    tenant: Tenant;
    hsn: HsnCode;
    createdat: Date;
    updatedat: Date;
}
export declare class Invoice {
    id: string;
    invoiceNumber: string;
    clientName: string;
    amount: number;
    dueDate: Date;
    status: string;
    items?: any;
    tenant: Tenant;
    invoiceItems: InvoiceItem[];
    createdAt: Date;
    updatedAt: Date;
}
export declare class InvoiceItem {
    id: number;
    description: string;
    quantity: number;
    unit: string;
    unitprice: number;
    amount: number;
    taxrate: number;
    taxamount: number;
    cessrate?: number;
    cessamount: number;
    metadata?: any;
    invoice: Invoice;
    product: Product;
    hsn: HsnCode;
    tenant: Tenant;
    createdat: Date;
    updatedat: Date;
}
export declare class User {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    pushToken?: string;
    role: string;
    biometricEnabled: boolean;
    tenant: Tenant;
    notifications: Notification[];
    createdAt: Date;
    updatedAt: Date;
}
export declare class Notification {
    id: string;
    title: string;
    body: string;
    data?: any;
    isRead: boolean;
    type?: string;
    priority: string;
    user: User;
    createdAt: Date;
}
export declare class Subscription {
    id: string;
    tenant: Tenant;
    name: string;
    description?: string;
    status: string;
    billingCycle: string;
    price: number;
    features: any;
    userLimit: number;
    invoiceLimit: number;
    isActive: boolean;
    currentPeriodStart?: Date;
    currentPeriodEnd?: Date;
    cancelAt?: Date;
    cancelAtPeriodEnd: boolean;
    stripeSubscriptionId?: string;
    stripeCustomerId?: string;
    stripePriceId?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class SyncLog {
    id: string;
    results: any;
    tenant: Tenant;
    user: User;
    timestamp: Date;
}
//# sourceMappingURL=allentity.d.ts.map