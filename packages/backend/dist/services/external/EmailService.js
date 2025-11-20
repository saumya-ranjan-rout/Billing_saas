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
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
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
}
exports.EmailService = EmailService;
//# sourceMappingURL=EmailService.js.map