import { TenantAwareEntity } from './BaseEntity';
import { Tenant } from './Tenant';
export declare enum ReportType {
    GSTR1_OUTWARD_SUPPLIES = "gstr1_outward_supplies",
    GSTR2B_PURCHASE_RECONCILIATION = "gstr2b_purchase_reconciliation",
    GSTR3B_SUMMARY = "gstr3b_summary",
    E_INVOICE_REGISTER = "e_invoice_register",
    E_WAY_BILL_REGISTER = "e_way_bill_register",
    HSN_SUMMARY = "hsn_summary",
    GSTR9_ANNUAL_RETURN = "gstr9_annual_return",
    GSTR9C_RECONCILIATION = "gstr9c_reconciliation",
    RCM_REPORT = "rcm_report",
    SALES_REGISTER = "sales_register",
    PURCHASE_REGISTER = "purchase_register",
    TDS_REPORT = "tds_report",
    PROFIT_LOSS = "profit_loss",
    BALANCE_SHEET = "balance_sheet",
    FORM26AS_RECONCILIATION = "form26as_reconciliation",
    DEPRECIATION_REGISTER = "depreciation_register",
    AUDIT_TRAIL = "audit_trail",
    CASH_BANK_BOOK = "cash_bank_book",
    LEDGER_REPORT = "ledger_report",
    EXPENSE_CATEGORY = "expense_category",
    RECONCILIATION_SUMMARY = "reconciliation_summary"
}
export declare enum ReportFormat {
    JSON = "json",
    EXCEL = "excel",
    PDF = "pdf",
    CSV = "csv"
}
export declare enum ReportStatus {
    PENDING = "pending",
    GENERATING = "generating",
    COMPLETED = "completed",
    FAILED = "failed"
}
export declare class Report extends TenantAwareEntity {
    name: string;
    type: ReportType;
    format: ReportFormat;
    status: ReportStatus;
    parameters: Record<string, any>;
    filters: {
        fromDate: Date;
        toDate: Date;
        customerIds?: string[];
        vendorIds?: string[];
        productIds?: string[];
        status?: string[];
    };
    filePath: string;
    recordCount: number;
    generatedAt: Date;
    errorMessage: string;
    tenant: Tenant;
}
//# sourceMappingURL=Report.d.ts.map