"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheService = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const logger_1 = __importDefault(require("../../utils/logger"));
class CacheService {
    constructor() {
        this.DEFAULT_TTL = 300;
        this.redis = new ioredis_1.default({
            host: process.env.REDIS_HOST || 'localhost',
            port: Number(process.env.REDIS_PORT) || 6379,
            password: process.env.REDIS_PASSWORD,
            maxRetriesPerRequest: 3,
            retryStrategy(times) {
                return Math.min(times * 50, 2000);
            },
        });
        this.redis.on('error', (error) => {
            logger_1.default.error('Redis connection error:', error);
        });
    }
    async set(key, value, ttl = this.DEFAULT_TTL) {
        try {
            const serializedValue = JSON.stringify(value);
            if (ttl > 0) {
                await this.redis.set(key, serializedValue, 'EX', ttl);
            }
            else {
                await this.redis.set(key, serializedValue);
            }
        }
        catch (error) {
            logger_1.default.error(`Cache set error [${key}]:`, error);
        }
    }
    async get(key) {
        try {
            const value = await this.redis.get(key);
            return value ? JSON.parse(value) : null;
        }
        catch (error) {
            logger_1.default.error(`Cache get error [${key}]:`, error);
            return null;
        }
    }
    get rediss() {
        return this.redis;
    }
    async del(key) {
        try {
            await this.redis.del(key);
        }
        catch (error) {
            logger_1.default.error(`Cache delete error [${key}]:`, error);
        }
    }
    async getOrSet(key, factory, ttl = this.DEFAULT_TTL) {
        const cached = await this.get(key);
        if (cached !== null) {
            return cached;
        }
        const value = await factory();
        await this.set(key, value, ttl);
        return value;
    }
    async invalidatePattern(pattern) {
        try {
            const keys = [];
            const stream = this.redis.scanStream({ match: pattern, count: 100 });
            for await (const chunk of stream) {
                keys.push(...chunk);
            }
            if (keys.length > 0) {
                await this.redis.del(...keys);
                logger_1.default.info(`🧹 Cleared ${keys.length} cache keys matching ${pattern}`);
            }
        }
        catch (error) {
            logger_1.default.error(`Cache invalidate pattern error [${pattern}]:`, error);
        }
    }
    async mset(values, ttl = this.DEFAULT_TTL) {
        try {
            const pipeline = this.redis.pipeline();
            values.forEach((value, key) => {
                const serialized = JSON.stringify(value);
                if (ttl > 0) {
                    pipeline.set(key, serialized, 'EX', ttl);
                }
                else {
                    pipeline.set(key, serialized);
                }
            });
            await pipeline.exec();
        }
        catch (error) {
            logger_1.default.error('Cache mset error:', error);
        }
    }
    async healthCheck() {
        try {
            await this.redis.ping();
            return true;
        }
        catch (error) {
            logger_1.default.error('Redis health check failed:', error);
            return false;
        }
    }
}
exports.CacheService = CacheService;
CacheService.Keys = {
    tenantDashboard: (tenantId) => `dashboard:${tenantId}`,
    invoiceList: (tenantId, page, limit, search, status) => `invoices:${tenantId}:${page}:${limit || ''}:${search || ''}:${status || ''}`,
    customerList: (tenantId) => `customers:${tenantId}`,
    reportData: (reportId) => `report:${reportId}`,
};
//# sourceMappingURL=CacheService.js.map