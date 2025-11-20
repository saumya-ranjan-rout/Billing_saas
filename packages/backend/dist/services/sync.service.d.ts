import { Invoice } from '../entities/Invoice';
import { Client } from '../entities/Client';
export declare class SyncService {
    private invoiceRepository;
    private clientRepository;
    private syncLogRepository;
    syncData(tenantId: string, userId: string, entities: any): Promise<{
        created: {
            invoices: number;
            clients: number;
        };
        updated: {
            invoices: number;
            clients: number;
        };
        conflicts: any[];
    }>;
    getUpdatesSince(tenantId: string, since: Date): Promise<{
        invoices: Invoice[];
        clients: Client[];
    }>;
}
//# sourceMappingURL=sync.service.d.ts.map