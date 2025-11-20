import Redis from 'ioredis';
export declare class CacheService {
    private redis;
    private readonly DEFAULT_TTL;
    constructor();
    set(key: string, value: any, ttl?: number): Promise<void>;
    get<T>(key: string): Promise<T | null>;
    get rediss(): Redis;
    del(key: string): Promise<void>;
    getOrSet<T>(key: string, factory: () => Promise<T>, ttl?: number): Promise<T>;
    invalidatePattern(pattern: string): Promise<void>;
    mset(values: Map<string, any>, ttl?: number): Promise<void>;
    healthCheck(): Promise<boolean>;
    static Keys: {
        tenantDashboard: (tenantId: string) => string;
        invoiceList: (tenantId: string, page: number, limit?: number, search?: string, status?: string) => string;
        customerList: (tenantId: string) => string;
        reportData: (reportId: string) => string;
    };
}
//# sourceMappingURL=CacheService.d.ts.map