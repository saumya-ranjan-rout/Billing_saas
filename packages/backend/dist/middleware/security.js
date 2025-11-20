"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.securityMiddleware = void 0;
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const rate_limiter_flexible_1 = require("rate-limiter-flexible");
const redis_1 = require("../config/redis");
const logger_1 = __importDefault(require("../utils/logger"));
const rateLimiter = new rate_limiter_flexible_1.RateLimiterRedis({
    storeClient: redis_1.redis,
    points: parseInt(process.env.RATE_LIMIT_POINTS || '100'),
    duration: parseInt(process.env.RATE_LIMIT_DURATION || '1'),
    blockDuration: parseInt(process.env.RATE_LIMIT_BLOCK_DURATION || '60'),
});
exports.securityMiddleware = [
    (0, cors_1.default)({
        origin: process.env.CORS_ORIGIN?.split(',') || true,
        credentials: true,
        maxAge: 86400,
    }),
    (0, helmet_1.default)({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'"],
                imgSrc: ["'self'", "data:", "https:"],
            },
        },
        hsts: {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true,
        },
    }),
    (0, compression_1.default)({
        level: 6,
        threshold: 1024,
        filter: (req, res) => {
            if (req.headers['x-no-compression'])
                return false;
            return compression_1.default.filter(req, res);
        },
    }),
    async (req, res, next) => {
        try {
            const tenantId = req.tenantId || 'unknown';
            const ip = req.ip || req.connection.remoteAddress || 'unknown';
            const rateKey = `${tenantId}:${ip}`;
            await rateLimiter.consume(rateKey);
            next();
        }
        catch (rejRes) {
            logger_1.default.warn(`Rate limit exceeded for a user`);
            res.status(429).json({
                error: 'Too Many Requests',
                retryAfter: Math.ceil(rejRes.msBeforeNext / 1000),
            });
        }
    },
];
//# sourceMappingURL=security.js.map