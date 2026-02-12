/**
 * Debug fetch interceptor — patches globalThis.fetch to log all outgoing requests.
 * Import this module ONCE at the app entry point (index.tsx) to activate.
 * Safe to leave in production; the overhead is negligible.
 */

const originalFetch = globalThis.fetch;

globalThis.fetch = async function debugFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
  const method = init?.method ?? 'GET';

  // Only log Google AI / googleapis calls (and anything that looks like it's going to our own origin)
  const isGoogleAI = url.includes('generativelanguage.googleapis.com');
  const isRelative = url.startsWith('/') || (!url.startsWith('http://') && !url.startsWith('https://'));
  const isSameOrigin = url.startsWith(globalThis.location?.origin ?? '___never___');

  if (isGoogleAI || isRelative || isSameOrigin) {
    console.log(`[debug-fetch] ${method} ${url.substring(0, 200)}`);
  }

  try {
    const response = await originalFetch.call(globalThis, input, init);

    // Log non-OK or unexpected content-type for Google AI calls
    if (isGoogleAI || isRelative) {
      const ct = response.headers.get('content-type') ?? '(none)';
      if (!response.ok || ct.includes('text/html')) {
        console.error(
          `[debug-fetch] PROBLEM: ${method} ${url.substring(0, 200)} → ${response.status} ${response.statusText} | content-type: ${ct}`
        );
        // Clone so the caller can still read the body
        const clone = response.clone();
        const body = await clone.text();
        console.error(`[debug-fetch] Response body (first 500 chars): ${body.substring(0, 500)}`);
      }
    }

    return response;
  } catch (err) {
    console.error(`[debug-fetch] NETWORK ERROR: ${method} ${url.substring(0, 200)} →`, err);
    throw err;
  }
};

// Also log some diagnostic info at load time
console.log('[debug-fetch] Interceptor installed');
console.log('[debug-fetch] Current origin:', globalThis.location?.origin);
console.log('[debug-fetch] process.env.API_KEY defined:', typeof process.env.API_KEY !== 'undefined', '| truthy:', !!process.env.API_KEY);
console.log('[debug-fetch] process.env.API_KEY value (first 8 chars):', process.env.API_KEY?.substring(0, 8) ?? '(undefined)');
console.log('[debug-fetch] process.env.GEMINI_API_KEY value (first 8 chars):', process.env.GEMINI_API_KEY?.substring(0, 8) ?? '(undefined)');
