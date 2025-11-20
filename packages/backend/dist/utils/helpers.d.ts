import { InvoiceItem } from '../types/customTypes';
export declare const generateInvoiceNumber: () => string;
export declare const calculateInvoiceTotals: (items: InvoiceItem[]) => {
    subtotal: number;
    tax: number;
    total: number;
};
export declare const formatCurrency: (amount: number, currency?: string) => string;
export declare const formatDate: (date: Date, includeTime?: boolean) => string;
export declare const isWithinBusinessHours: () => boolean;
export declare const sanitizeInput: (input: string) => string;
export declare const generateRandomString: (length?: number) => string;
//# sourceMappingURL=helpers.d.ts.map