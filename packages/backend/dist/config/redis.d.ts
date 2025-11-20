import Redis from 'ioredis';
declare class RedisClusterManager {
    private static instance;
    private static isConnected;
    static getInstance(): Redis;
    static healthCheck(): Promise<boolean>;
    static getConnectionStatus(): boolean;
}
export declare const redis: Redis;
export declare const redisHealthCheck: typeof RedisClusterManager.healthCheck;
export {};
//# sourceMappingURL=redis.d.ts.map