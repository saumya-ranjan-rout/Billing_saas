import Razorpay from "razorpay";
import crypto from "crypto";

export class RazorpayService {
  private instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

  async createOrder(amount: number): Promise<any> {
    return await this.instance.orders.create({
      amount: amount * 100, // amount in paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,   // 🔥 Required field
      payment_capture: 1,
    });
  }

  verifyWebhookSignature(body: any, signature: string, secret: string) {
    const expected = crypto
      .createHmac("sha256", secret)
      .update(JSON.stringify(body))
      .digest("hex");

    return expected === signature;
  }
}
