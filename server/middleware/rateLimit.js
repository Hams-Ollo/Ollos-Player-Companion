/**
 * 🛡️ Rate Limiting Middleware
 *
 * Sliding-window rate limiter using in-memory storage.
 * Supports per-user (keyed by Firebase UID) and global modes.
 *
 * For a small-to-medium user base, in-memory is fine.
 * If you scale to multiple Cloud Run instances, replace with Redis.
 */

/**
 * Create a rate limiter middleware.
 * @param {{ windowMs: number, maxRequests: number, global?: boolean }} opts
 */
export function createRateLimiter({ windowMs = 60_000, maxRequests = 20, global = false } = {}) {
  const hits = new Map(); // key → [timestamps]
  const GLOBAL_KEY = '__global__';

  // Cleanup old entries every 2 minutes
  setInterval(() => {
    const cutoff = Date.now() - windowMs;
    for (const [key, timestamps] of hits) {
      const filtered = timestamps.filter((t) => t > cutoff);
      if (filtered.length === 0) {
        hits.delete(key);
      } else {
        hits.set(key, filtered);
      }
    }
  }, 2 * 60_000);

  return (req, res, next) => {
    const key = global ? GLOBAL_KEY : req.user?.uid || req.ip;
    const now = Date.now();
    const cutoff = now - windowMs;

    // Get existing timestamps and filter old ones
    const timestamps = (hits.get(key) || []).filter((t) => t > cutoff);

    if (timestamps.length >= maxRequests) {
      const oldestInWindow = timestamps[0];
      const retryAfterMs = windowMs - (now - oldestInWindow);
      const retryAfterSec = Math.ceil(retryAfterMs / 1000);

      res.setHeader('X-RateLimit-Limit', String(maxRequests));
      res.setHeader('X-RateLimit-Remaining', '0');
      res.setHeader('Retry-After', String(retryAfterSec));

      return res.status(429).json({
        error: 'Rate limit exceeded',
        retryAfter: retryAfterSec,
        message: global
          ? 'The Weave trembles under heavy use. Please wait a moment.'
          : 'Slow down, adventurer! The Weave needs a moment to settle.',
      });
    }

    // Record this request
    timestamps.push(now);
    hits.set(key, timestamps);

    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', String(maxRequests));
    res.setHeader('X-RateLimit-Remaining', String(maxRequests - timestamps.length));

    next();
  };
}
