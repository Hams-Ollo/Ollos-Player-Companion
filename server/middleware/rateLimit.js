/**
 * 🛡️ Rate Limiting Middleware
 *
 * Sliding-window rate limiter. Uses Redis (via REDIS_URL) when available so
 * limits are enforced consistently across all Cloud Run instances. Falls back
 * to in-memory if Redis is unavailable — so local dev works without Redis.
 *
 * Redis key pattern: rl:{uid}:{windowBucket}  (per-user)
 *                    rl:__global__:{windowBucket}  (global)
 *
 * The window bucket is floor(Date.now() / windowMs), giving a tumbling window.
 * Each key has a TTL of windowSec + 5 so Redis auto-cleans stale keys.
 */

import { redisClient } from '../lib/redis.js';

/**
 * Create a rate limiter middleware.
 * @param {{ windowMs: number, maxRequests: number, global?: boolean }} opts
 */
export function createRateLimiter({ windowMs = 60_000, maxRequests = 20, global = false } = {}) {
  const GLOBAL_KEY = '__global__';
  const windowSec = Math.ceil(windowMs / 1000);

  // In-memory fallback (used when Redis is unavailable)
  const hits = new Map(); // key → [timestamps]
  setInterval(() => {
    const cutoff = Date.now() - windowMs;
    for (const [key, timestamps] of hits) {
      const filtered = timestamps.filter((t) => t > cutoff);
      if (filtered.length === 0) hits.delete(key);
      else hits.set(key, filtered);
    }
  }, 2 * 60_000);

  return async (req, res, next) => {
    const key = global ? GLOBAL_KEY : (req.user?.uid || 'anon');
    const bucket = Math.floor(Date.now() / windowMs);
    const redisKey = `rl:${key}:${bucket}`;

    let count;

    if (redisClient && redisClient.status === 'ready') {
      try {
        // Atomic increment + set TTL in a single pipeline
        const pipeline = redisClient.pipeline();
        pipeline.incr(redisKey);
        pipeline.expire(redisKey, windowSec + 5);
        const [[incrErr, newCount]] = await pipeline.exec();
        if (incrErr) throw incrErr;
        count = newCount;
      } catch (err) {
        console.error('[RateLimit] Redis error, falling back to in-memory:', err.message);
        count = inMemoryIncr(key, hits, windowMs);
      }
    } else {
      count = inMemoryIncr(key, hits, windowMs);
    }

    const remaining = Math.max(0, maxRequests - count);
    res.setHeader('X-RateLimit-Limit', String(maxRequests));
    res.setHeader('X-RateLimit-Remaining', String(remaining));

    if (count > maxRequests) {
      res.setHeader('Retry-After', String(windowSec));
      return res.status(429).json({
        error: 'Rate limit exceeded',
        retryAfter: windowSec,
        message: global
          ? 'The Weave trembles under heavy use. Please wait a moment.'
          : 'Slow down, adventurer! The Weave needs a moment to settle.',
      });
    }

    next();
  };
}

/** In-memory sliding window increment — returns new request count in window. */
function inMemoryIncr(key, hits, windowMs) {
  const now = Date.now();
  const cutoff = now - windowMs;
  const timestamps = (hits.get(key) || []).filter((t) => t > cutoff);
  timestamps.push(now);
  hits.set(key, timestamps);
  return timestamps.length;
}
