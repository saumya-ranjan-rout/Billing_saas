"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisHealthCheck = exports.redis = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const logger_1 = __importDefault(require("../utils/logger"));
class RedisClusterManager {
    static getInstance() {
        if (!this.instance) {
            this.instance = new ioredis_1.default({
                host: process.env.REDIS_HOST || 'redis',
                port: parseInt(process.env.REDIS_PORT || '6379'),
                maxRetriesPerRequest: 3,
                enableReadyCheck: true,
                connectTimeout: 10000,
                commandTimeout: 5000,
                lazyConnect: true,
            });
            this.instance.on('connect', () => {
                this.isConnected = true;
                logger_1.default.info('Redis connected successfully');
            });
            this.instance.on('error', (error) => {
                logger_1.default.error('Redis connection error:', error);
                this.isConnected = false;
            });
            this.instance.on('close', () => {
                this.isConnected = false;
                logger_1.default.warn('Redis connection closed');
            });
        }
        return this.instance;
    }
    static async healthCheck() {
        try {
            await this.instance.ping();
            return true;
        }
        catch {
            return false;
        }
    }
    static getConnectionStatus() {
        return this.isConnected;
    }
}
RedisClusterManager.isConnected = false;
exports.redis = RedisClusterManager.getInstance();
exports.redisHealthCheck = RedisClusterManager.healthCheck;
//# sourceMappingURL=redis.js.map