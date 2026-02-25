import type { Request, Response, NextFunction } from 'express';

/**
 * Simple in-memory rate limiter.
 * Will be replaced with Redis-based limiter in Phase 3.
 */
const requestCounts = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(maxRequests = 100, windowMs = 60_000) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const key = req.ip ?? 'unknown';
    const now = Date.now();
    const entry = requestCounts.get(key);

    if (!entry || now > entry.resetAt) {
      requestCounts.set(key, { count: 1, resetAt: now + windowMs });
      next();
      return;
    }

    if (entry.count >= maxRequests) {
      res.status(429).json({ error: 'Too many requests' });
      return;
    }

    entry.count++;
    next();
  };
}
