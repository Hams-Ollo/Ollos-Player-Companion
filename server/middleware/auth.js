/**
 * 🔐 Firebase Admin Token Verification Middleware
 *
 * Verifies the Firebase ID token sent in the Authorization header.
 * Rejects requests that are missing or have invalid tokens.
 *
 * We use the Firebase REST API to verify tokens instead of the full
 * firebase-admin SDK to keep the server dependency footprint small.
 * The token is verified by calling Google's tokeninfo endpoint.
 */

// Lightweight token verification via Google's public keys
// This avoids pulling in the heavy firebase-admin SDK (~50MB)

const TOKEN_CACHE = new Map(); // uid → { exp, uid, email }
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Verify a Firebase ID token by calling Google's tokeninfo endpoint.
 * Caches verified tokens for 5 minutes to reduce latency.
 */
async function verifyToken(idToken) {
  // Check cache first
  const cached = TOKEN_CACHE.get(idToken);
  if (cached && Date.now() < cached.cachedAt + CACHE_TTL_MS) {
    return cached;
  }

  // Verify via Google's secure token verification endpoint
  const FIREBASE_PROJECT_ID = process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || '';

  const response = await fetch(
    `https://www.googleapis.com/identitytoolkit/v3/relyingparty/getAccountInfo?key=${process.env.FIREBASE_WEB_API_KEY || ''}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    }
  );

  if (!response.ok) {
    throw new Error('Token verification failed');
  }

  const data = await response.json();
  if (!data.users || data.users.length === 0) {
    throw new Error('No user found for token');
  }

  const user = data.users[0];
  const decoded = {
    uid: user.localId,
    email: user.email || null,
    displayName: user.displayName || null,
    cachedAt: Date.now(),
  };

  TOKEN_CACHE.set(idToken, decoded);

  // Prune cache periodically (keep under 1000 entries)
  if (TOKEN_CACHE.size > 1000) {
    const now = Date.now();
    for (const [key, val] of TOKEN_CACHE) {
      if (now - val.cachedAt > CACHE_TTL_MS) TOKEN_CACHE.delete(key);
    }
  }

  return decoded;
}

/**
 * Express middleware: extracts and verifies Firebase ID token from
 * the Authorization header. Sets req.user = { uid, email, displayName }.
 */
export async function verifyFirebaseToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decoded = await verifyToken(idToken);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('[Auth] Token verification failed:', err.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
