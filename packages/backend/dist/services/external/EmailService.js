"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const errors_1 = require("../../utils/errors");
class EmailService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || "587"),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
        this.transporter.verify((error, success) => {
            if (error) {
                console.error("SMTP Error:", error);
            }
            else {
                console.log("SMTP Server is ready to send emails");
            }
        });
    }
    async sendGeneratedInvoiceEmail(to, invoiceNo, pdfBuffer) {
        const resetLink = `${process.env.FRONTEND_URL}/auth/login`;
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to,
            subject: `GST Invoice ${invoiceNo}`,
            html: `
      <h2>Your GST Invoice</h2>
      <p>Please find the attached invoice.</p>
      <p>Invoice No: <strong>${invoiceNo}</strong></p>
 
      <hr />
 
      <p><strong>Automate Your Billing</strong></p>
      <p>
        Invoices, reminders & GST reports — done automatically.
      </p>
 
      <p>
        <a href="${resetLink}"
           style="
             display: inline-block;
             padding: 10px 18px;
             background: #3182ce;
             color: #ffffff;
             text-decoration: none;
             border-radius: 6px;
             font-weight: 500;
           ">
          Start Free 15-Day Trial
        </a>
      </p>
 
      <p style="font-size: 12px; color: #718096;">
        No credit card required.
      </p>
    `,
            attachments: [
                {
                    filename: `GST-Invoice-${invoiceNo}.pdf`,
                    content: pdfBuffer,
                    contentType: "application/pdf",
                },
            ],
        };
        try {
            await this.transporter.sendMail(mailOptions);
        }
        catch (error) {
            throw new errors_1.BadRequestError("Failed to send GST invoice email");
        }
    }
    async sendInvitationEmail(to, userId, tenantId) {
        const invitationLink = `${process.env.FRONTEND_URL}/invite?token=${this.generateInvitationToken(userId, tenantId)}`;
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to,
            subject: "Invitation to join BillingSaaS",
            html: `
        <h2>You've been invited to join BillingSaaS</h2>
        <p>Click the link below to accept your invitation and set up your account:</p>
        <a href="${invitationLink}">Accept Invitation</a>
        <p>This link will expire in 24 hours.</p>
      `,
        };
        try {
            await this.transporter.sendMail(mailOptions);
        }
        catch (error) {
            throw new errors_1.BadRequestError("Failed to send invitation email");
        }
    }
    async sendPasswordResetEmail(to, resetToken) {
        const resetLink = `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`;
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to,
            subject: "Password Reset Request",
            html: `
        <h2>Password Reset Request</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this reset, please ignore this email.</p>
      `,
        };
        try {
            await this.transporter.sendMail(mailOptions);
        }
        catch (error) {
            throw new errors_1.BadRequestError("Failed to send password reset email");
        }
    }
    async sendInvoiceEmail(to, invoiceId, pdfBuffer) {
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to,
            subject: "Your Invoice",
            html: `
        <h2>Invoice Attached</h2>
        <p>Please find your invoice attached to this email.</p>
        <p>Thank you for your business!</p>
      `,
            attachments: [
                {
                    filename: `invoice-${invoiceId}.pdf`,
                    content: pdfBuffer,
                    contentType: "application/pdf",
                },
            ],
        };
        try {
            await this.transporter.sendMail(mailOptions);
        }
        catch (error) {
            throw new errors_1.BadRequestError("Failed to send invoice email");
        }
    }
    generateInvitationToken(userId, tenantId) {
        return "invitation-token";
    }
    async sendSubscriptionExpiryMail({ to, daysLeft, endDate, }) {
        const subject = daysLeft === 0
            ? "Your subscription expires today"
            : `Your subscription expires in ${daysLeft} days`;
        const html = `
    <h2>Subscription Expiry Notice</h2>

    <p>
      ${daysLeft === 0
            ? "Your subscription expires <strong>today</strong>."
            : `Your subscription will expire in <strong>${daysLeft} days</strong>.`}
    </p>

    <p>
      <strong>Expiry Date:</strong> ${endDate.toDateString()}
    </p>

    <p>
      Please renew your subscription to avoid any interruption in services.
    </p>

    <a
      href="${process.env.FRONTEND_URL}/auth/login"
      style="
        display:inline-block;
        padding:10px 16px;
        background:#2563eb;
        color:#ffffff;
        text-decoration:none;
        border-radius:6px;
        margin-top:10px;
      "
    >
      Renew Subscription
    </a>

    <p style="margin-top:20px">
      Regards,<br />
      Billing Team
    </p>
  `;
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to,
            subject,
            html,
        };
        await this.transporter.sendMail(mailOptions);
    }
}
exports.EmailService = EmailService;
//# sourceMappingURL=EmailService.js.map