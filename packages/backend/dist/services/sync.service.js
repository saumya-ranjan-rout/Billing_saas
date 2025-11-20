"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncService = void 0;
const typeorm_1 = require("typeorm");
const Invoice_1 = require("../entities/Invoice");
const Client_1 = require("../entities/Client");
const SyncLog_1 = require("../entities/SyncLog");
const database_1 = require("../config/database");
class SyncService {
    constructor() {
        this.invoiceRepository = database_1.AppDataSource.getRepository(Invoice_1.Invoice);
        this.clientRepository = database_1.AppDataSource.getRepository(Client_1.Client);
        this.syncLogRepository = database_1.AppDataSource.getRepository(SyncLog_1.SyncLog);
    }
    async syncData(tenantId, userId, entities) {
        const results = {
            created: { invoices: 0, clients: 0 },
            updated: { invoices: 0, clients: 0 },
            conflicts: []
        };
        if (entities.invoices) {
            for (const invoiceData of entities.invoices) {
                try {
                    if (invoiceData.id.startsWith('local_')) {
                        const { id: localId, ...invoice } = invoiceData;
                        const newInvoice = this.invoiceRepository.create({
                            ...invoice,
                            tenant: { id: tenantId }
                        });
                        await this.invoiceRepository.save(newInvoice);
                        results.created.invoices++;
                    }
                    else {
                        await this.invoiceRepository.update({ id: invoiceData.id, tenant: { id: tenantId } }, invoiceData);
                        results.updated.invoices++;
                    }
                }
                catch (err) {
                    const error = err instanceof Error ? err : new Error(String(err));
                    results.conflicts.push({
                        entity: 'invoice',
                        id: invoiceData.id,
                        error: error.message
                    });
                }
            }
        }
        if (entities.clients) {
            for (const clientData of entities.clients) {
                try {
                    if (clientData.id.startsWith('local_')) {
                        const { id: localId, ...client } = clientData;
                        const newClient = this.clientRepository.create({
                            ...client,
                            tenant: { id: tenantId }
                        });
                        await this.clientRepository.save(newClient);
                        results.created.clients++;
                    }
                    else {
                        await this.clientRepository.update({ id: clientData.id, tenant: { id: tenantId } }, clientData);
                        results.updated.clients++;
                    }
                }
                catch (err) {
                    const error = err instanceof Error ? err : new Error(String(err));
                    results.conflicts.push({
                        entity: 'client',
                        id: clientData.id,
                        error: error.message
                    });
                }
            }
        }
        const syncLog = this.syncLogRepository.create({
            tenant: { id: tenantId },
            user: { id: userId },
            results: JSON.stringify(results),
            timestamp: new Date()
        });
        await this.syncLogRepository.save(syncLog);
        return results;
    }
    async getUpdatesSince(tenantId, since) {
        const invoices = await this.invoiceRepository.find({
            where: {
                tenant: { id: tenantId },
                updatedAt: (0, typeorm_1.MoreThan)(since)
            }
        });
        const clients = await this.clientRepository.find({
            where: {
                tenant: { id: tenantId },
                updatedAt: (0, typeorm_1.MoreThan)(since)
            }
        });
        return { invoices, clients };
    }
}
exports.SyncService = SyncService;
//# sourceMappingURL=sync.service.js.map