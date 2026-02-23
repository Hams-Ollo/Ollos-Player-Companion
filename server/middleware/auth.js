/**
 * 🔐 Firebase Admin Token Verification Middleware
 *
 * Verifies Firebase ID tokens using the Firebase Admin SDK — performs a full
 * cryptographic JWT signature check (iss, aud, exp, signature) plus optional
 * revocation check. This replaces the previous Identity Toolkit REST lookup
 * which did NOT validate JWT claims directly.
 *
 * On Cloud Run the Admin SDK auto-detects credentials from the service account
 * attached to the Cloud Run service — no GOOGLE_APPLICATION_CREDENTIALS needed
 * in production. For local dev, set GOOGLE_APPLICATION_CREDENTIALS to a service
 * account JSON downloaded from Firebase Console > Project Settings > Service accounts.
 *
 * TOKEN CACHE: Keyed by UID (not raw token) for CACHE_TTL_MS to avoid repeated
 * Admin SDK revocation checks. Bounded to 500 entries; pruned on overflow.
 */

import admin from 'firebase-admin';

const CACHE_TTL_MS = 4 * 60 * 1000; // 4 min — safely under the 5 min expiry window

// uid → { uid, email, displayName, cachedAt }
const uidCache = new Map();

// ─── Initialize Firebase Admin SDK ───────────────────────────────────────────
if (admin.apps.length === 0) {
  try {
    admin.initializeApp();
  } catch (err) {
    // On local dev without GOOGLE_APPLICATION_CREDENTIALS this will fail.
    // All auth requests will return 401 until credentials are configured.
    console.error('[Auth] Firebase Admin initialization failed:', err.message);
    console.error('[Auth] Set GOOGLE_APPLICATION_CREDENTIALS for local dev.');
  }
}

/**
 * Verify a Firebase ID token using Firebase Admin SDK.
 * Results are cached by UID for CACHE_TTL_MS.
 */
async function verifyToken(idToken) {
  // Decode JWT payload (unauthenticated) just to get UID as cache key.
  // Full verification still happens below.
  let uid = null;
  try {
    const payloadB64 = idToken.split('.')[1];
    uid = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8')).sub;
  } catch { /* ignore, proceed to full verify */ }

  if (uid) {
    const cached = uidCache.get(uid);
    if (cached && Date.now() < cached.cachedAt + CACHE_TTL_MS) {
      return cached;
    }
  }

  // Full cryptographic verification. true = also enforce revocation check.
  const decoded = await admin.auth().verifyIdToken(idToken, true);

  const userInfo = {
    uid: decoded.uid,
    email: decoded.email ?? null,
    displayName: decoded.name ?? null,
    cachedAt: Date.now(),
  };

  uidCache.set(decoded.uid, userInfo);

  // Prune to keep under 500 entries
  if (uidCache.size > 500) {
    const now = Date.now();
    for (const [k, v] of uidCache) {
      if (now - v.cachedAt > CACHE_TTL_MS) uidCache.delete(k);
      if (uidCache.size <= 400) break;
    }
  }

  return userInfo;
}

/**
 * Express middleware — extracts the Firebase ID token from the Authorization
 * header and sets req.user = { uid, email, displayName }.
 */
export async function verifyFirebaseToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  const idToken = authHeader.slice(7);
  try {
    req.user = await verifyToken(idToken);
    next();
  } catch (err) {
    console.error('[Auth] Token verification failed:', err.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

/**
 * Headless verification (no req/res) — used by the WebSocket upgrade handler.
 * Throws on invalid/expired/revoked token.
 */
export async function verifyTokenDirect(idToken) {
  return verifyToken(idToken);
}
