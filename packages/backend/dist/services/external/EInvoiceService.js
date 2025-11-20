"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EInvoiceService = void 0;
const axios_1 = __importDefault(require("axios"));
const errors_1 = require("../../utils/errors");
class EInvoiceService {
    constructor() {
        this.apiBaseUrl = process.env.GSTN_API_BASE_URL ?? "";
        this.authToken = process.env.GSTN_AUTH_TOKEN ?? "";
    }
    async generateIRN(invoice) {
        try {
            const payload = this.prepareEInvoicePayload(invoice);
            const response = await axios_1.default.post(`${this.apiBaseUrl}/invoice`, payload, {
                headers: {
                    Authorization: `Bearer ${this.authToken}`,
                    "Content-Type": "application/json",
                },
            });
            if (response.data.Status === "1") {
                return {
                    irn: response.data.Data.Irn,
                    ackNo: response.data.Data.AckNo,
                    ackDate: new Date(response.data.Data.AckDt),
                    signedQRCode: response.data.Data.SignedQRCode,
                };
            }
            else {
                throw new errors_1.BadRequestError(`E-Invoice generation failed: ${response.data.ErrorMessage}`);
            }
        }
        catch (err) {
            if (err.response) {
                throw new errors_1.BadRequestError(`GSTN API error: ${err.response.data.ErrorMessage}`);
            }
            throw new errors_1.BadRequestError(`Failed to generate E-Invoice: ${err.message}`);
        }
    }
    async cancelIRN(irn, reason, reasonCode) {
        try {
            const payload = {
                Irn: irn,
                CancelReason: reason,
                CancelRsnCode: reasonCode,
            };
            await axios_1.default.post(`${this.apiBaseUrl}/cancel`, payload, {
                headers: {
                    Authorization: `Bearer ${this.authToken}`,
                    "Content-Type": "application/json",
                },
            });
        }
        catch (error) {
            throw new errors_1.BadRequestError(`Failed to cancel E-Invoice: ${error.message}`);
        }
    }
    prepareEInvoicePayload(invoice) {
        return {
            Version: "1.1",
            TranDtls: {
                TaxSch: "GST",
                SupTyp: "B2B",
                RegRev: "N",
                EcmGstin: null,
                IgstOnIntra: "N",
            },
            DocDtls: {
                Typ: "INV",
                No: invoice.invoiceNumber,
                Dt: this.formatDate(invoice.issueDate ?? new Date()),
            },
            SellerDtls: {
                Gstin: invoice.gstin?.gstin,
                LglNm: invoice.gstin?.legalName,
                Addr1: invoice.gstin?.address?.line1,
                Addr2: invoice.gstin?.address?.line2,
                Loc: invoice.gstin?.address?.city,
                Pin: invoice.gstin?.address?.pincode,
                Stcd: invoice.gstin?.stateCode,
            },
            BuyerDtls: {
                Gstin: invoice.customer?.gstin,
                LglNm: invoice.customer?.name,
                Pos: invoice.customer?.billingAddress?.state,
                Addr1: invoice.customer?.billingAddress?.line1,
                Addr2: invoice.customer?.billingAddress?.line2,
                Loc: invoice.customer?.billingAddress?.city,
                Pin: invoice.customer?.billingAddress?.pincode,
                Stcd: invoice.customer?.billingAddress?.state,
            },
            ItemList: (invoice.items ?? []).map((item, idx) => ({
                SlNo: (idx + 1).toString(),
                PrdDesc: item.description,
                HsnCd: item.hsn?.code,
                Qty: item.quantity,
                Unit: item.unit,
                UnitPrice: item.unitPrice,
                TotAmt: item.amount,
                AssAmt: item.amount,
                GstRt: item.taxRate,
                IgstAmt: 0,
                CgstAmt: 0,
                SgstAmt: 0,
                CesRt: item.cessRate ?? 0,
                CesAmt: item.cessAmount ?? 0,
                CesNonAdvlAmt: 0,
                StateCesRt: 0,
                StateCesAmt: 0,
                StateCesNonAdvlAmt: 0,
                OthChrg: 0,
                TotItemVal: item.amount + (item.taxAmount ?? 0) + (item.cessAmount ?? 0),
            })),
            ValDtls: {
                AssVal: Number(invoice.subTotal ?? 0),
                CgstVal: 0,
                SgstVal: 0,
                IgstVal: 0,
                CesVal: 0,
                StCesVal: 0,
                Discount: Number(invoice.discountTotal ?? 0),
                OthChrg: 0,
                RndOffAmt: 0,
                TotInvVal: Number(invoice.totalAmount ?? 0),
            },
        };
    }
    formatDate(date) {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    }
}
exports.EInvoiceService = EInvoiceService;
//# sourceMappingURL=EInvoiceService.js.map