import express from 'express';
declare class ApplicationServer {
    private app;
    private port;
    constructor();
    private setupMiddleware;
    private setupRoutes;
    private setupErrorHandling;
    start(): Promise<void>;
    getApp(): express.Application;
}
export default ApplicationServer;
//# sourceMappingURL=app.d.ts.map