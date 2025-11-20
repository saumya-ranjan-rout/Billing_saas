"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RazorpayService = void 0;
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
class RazorpayService {
    constructor() {
        this.instance = new razorpay_1.default({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
    }
    async createOrder(amount) {
        return await this.instance.orders.create({
            amount: amount * 100,
            currency: "INR",
            receipt: `rcpt_${Date.now()}`,
            payment_capture: 1,
        });
    }
    verifyWebhookSignature(body, signature, secret) {
        const expected = crypto_1.default
            .createHmac("sha256", secret)
            .update(JSON.stringify(body))
            .digest("hex");
        return expected === signature;
    }
}
exports.RazorpayService = RazorpayService;
//# sourceMappingURL=RazorpayService.js.map