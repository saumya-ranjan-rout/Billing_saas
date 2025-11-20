"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Report = exports.ReportStatus = exports.ReportFormat = exports.ReportType = void 0;
const typeorm_1 = require("typeorm");
const BaseEntity_1 = require("./BaseEntity");
const Tenant_1 = require("./Tenant");
var ReportType;
(function (ReportType) {
    ReportType["GSTR1_OUTWARD_SUPPLIES"] = "gstr1_outward_supplies";
    ReportType["GSTR2B_PURCHASE_RECONCILIATION"] = "gstr2b_purchase_reconciliation";
    ReportType["GSTR3B_SUMMARY"] = "gstr3b_summary";
    ReportType["E_INVOICE_REGISTER"] = "e_invoice_register";
    ReportType["E_WAY_BILL_REGISTER"] = "e_way_bill_register";
    ReportType["HSN_SUMMARY"] = "hsn_summary";
    ReportType["GSTR9_ANNUAL_RETURN"] = "gstr9_annual_return";
    ReportType["GSTR9C_RECONCILIATION"] = "gstr9c_reconciliation";
    ReportType["RCM_REPORT"] = "rcm_report";
    ReportType["SALES_REGISTER"] = "sales_register";
    ReportType["PURCHASE_REGISTER"] = "purchase_register";
    ReportType["TDS_REPORT"] = "tds_report";
    ReportType["PROFIT_LOSS"] = "profit_loss";
    ReportType["BALANCE_SHEET"] = "balance_sheet";
    ReportType["FORM26AS_RECONCILIATION"] = "form26as_reconciliation";
    ReportType["DEPRECIATION_REGISTER"] = "depreciation_register";
    ReportType["AUDIT_TRAIL"] = "audit_trail";
    ReportType["CASH_BANK_BOOK"] = "cash_bank_book";
    ReportType["LEDGER_REPORT"] = "ledger_report";
    ReportType["EXPENSE_CATEGORY"] = "expense_category";
    ReportType["RECONCILIATION_SUMMARY"] = "reconciliation_summary";
})(ReportType = exports.ReportType || (exports.ReportType = {}));
var ReportFormat;
(function (ReportFormat) {
    ReportFormat["JSON"] = "json";
    ReportFormat["EXCEL"] = "excel";
    ReportFormat["PDF"] = "pdf";
    ReportFormat["CSV"] = "csv";
})(ReportFormat = exports.ReportFormat || (exports.ReportFormat = {}));
var ReportStatus;
(function (ReportStatus) {
    ReportStatus["PENDING"] = "pending";
    ReportStatus["GENERATING"] = "generating";
    ReportStatus["COMPLETED"] = "completed";
    ReportStatus["FAILED"] = "failed";
})(ReportStatus = exports.ReportStatus || (exports.ReportStatus = {}));
let Report = class Report extends BaseEntity_1.TenantAwareEntity {
};
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Report.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ReportType }),
    __metadata("design:type", String)
], Report.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ReportFormat }),
    __metadata("design:type", String)
], Report.prototype, "format", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ReportStatus, default: ReportStatus.PENDING }),
    __metadata("design:type", String)
], Report.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Report.prototype, "parameters", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Report.prototype, "filters", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Report.prototype, "filePath", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], Report.prototype, "recordCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Report.prototype, "generatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Report.prototype, "errorMessage", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Tenant_1.Tenant, tenant => tenant.reports),
    (0, typeorm_1.JoinColumn)({ name: 'tenantId' }),
    __metadata("design:type", Tenant_1.Tenant)
], Report.prototype, "tenant", void 0);
Report = __decorate([
    (0, typeorm_1.Entity)('reports')
], Report);
exports.Report = Report;
//# sourceMappingURL=Report.js.map