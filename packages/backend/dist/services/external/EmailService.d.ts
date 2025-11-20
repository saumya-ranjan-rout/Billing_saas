/// <reference types="node" />
/// <reference types="node" />
export declare class EmailService {
    private transporter;
    constructor();
    sendInvitationEmail(to: string, userId: string, tenantId: string): Promise<void>;
    sendPasswordResetEmail(to: string, resetToken: string): Promise<void>;
    sendInvoiceEmail(to: string, invoiceId: string, pdfBuffer: Buffer): Promise<void>;
    private generateInvitationToken;
}
//# sourceMappingURL=EmailService.d.ts.map