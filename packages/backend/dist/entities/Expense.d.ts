import { Tenant } from './Tenant';
export declare enum ExpenseCategory {
    OFFICE_SUPPLIES = "office_supplies",
    TRAVEL = "travel",
    UTILITIES = "utilities",
    SALARY = "salary",
    MARKETING = "marketing",
    SOFTWARE = "software",
    HARDWARE = "hardware",
    RENT = "rent",
    MAINTENANCE = "maintenance",
    OTHER = "other"
}
export declare enum PaymentMethod {
    CASH = "cash",
    BANK_TRANSFER = "bank_transfer",
    CHEQUE = "cheque",
    CARD = "card",
    ONLINE = "online"
}
export declare class Expense {
    id: string;
    description: string;
    amount: number;
    category: ExpenseCategory;
    paymentMethod: PaymentMethod;
    expenseDate: Date;
    referenceNumber: string;
    vendor: string;
    metadata: any;
    tenant: Tenant;
    tenantId: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
//# sourceMappingURL=Expense.d.ts.map