import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import { Request, Response, NextFunction } from 'express';
import { redis } from '../config/redis';
import logger from '../utils/logger';

// Advanced rate limiting with Redis storage
const rateLimiter = new RateLimiterRedis({
  storeClient: redis,
  points: parseInt(process.env.RATE_LIMIT_POINTS || '100'),
  duration: parseInt(process.env.RATE_LIMIT_DURATION || '1'),
  blockDuration: parseInt(process.env.RATE_LIMIT_BLOCK_DURATION || '60'),
});

export const securityMiddleware = [
  cors({
    origin: process.env.CORS_ORIGIN?.split(',') || true,
    credentials: true,
    maxAge: 86400,
  }),

  helmet({
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

  compression({
    level: 6,
    threshold: 1024,
    filter: (req: Request, res: Response) => {
      if (req.headers['x-no-compression']) return false;
      return compression.filter(req, res);
    },
  }),

  async (
    req: Request & { tenantId?: string },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const tenantId = req.tenantId || 'unknown';
      const ip = req.ip || req.socket.remoteAddress || 'unknown';

      const rateKey = `${tenantId}:${ip}`;

      await rateLimiter.consume(rateKey);
      next();
    } catch (rejRes: any) {
      logger.warn(`Rate limit exceeded for a user`);
      res.status(429).json({
        error: 'Too Many Requests',
        retryAfter: Math.ceil(rejRes.msBeforeNext / 1000),
      });
    }
  },
];
