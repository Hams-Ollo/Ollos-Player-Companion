/**
 * 🔴 Redis Client — Shared State for Rate Limiting
 *
 * Uses ioredis to connect to Cloud Memorystore Redis when REDIS_URL is set.
 * Falls back gracefully to null (which triggers in-memory fallback in rateLimit.js)
 * so local dev works without Redis running.
 *
 * Cloud Run setup:
 *   1. Provision a BASIC tier Cloud Memorystore Redis instance in the same region.
 *   2. Add Direct VPC egress to the Cloud Run service.
 *   3. Set REDIS_URL=redis://<private-ip>:6379 as a Cloud Run env var via Secret Manager.
 */

import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL;

let redisClient = null;

if (REDIS_URL) {
  redisClient = new Redis(REDIS_URL, {
    lazyConnect: false,
    maxRetriesPerRequest: 2,
    connectTimeout: 5_000,
    commandTimeout: 2_000,
    enableOfflineQueue: false, // Fail fast — don't queue commands when disconnected
    retryStrategy: (times) => {
      if (times > 3) return null; // Stop retrying after 3 attempts
      return Math.min(times * 200, 1000);
    },
  });

  redisClient.on('error', (err) => {
    // Log but don't crash — rateLimit.js falls back to in-memory on error
    console.error('[Redis] Connection error:', err.message);
  });

  redisClient.on('ready', () => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[Redis] Connected and ready');
    }
  });

  redisClient.on('reconnecting', () => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[Redis] Reconnecting...');
    }
  });
} else {
  if (process.env.NODE_ENV === 'production') {
    console.error('[Redis] WARNING: REDIS_URL not set. Rate limiting is per-instance only (ineffective with Cloud Run autoscaling).');
  }
}

export { redisClient };
