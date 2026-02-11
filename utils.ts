// Rate Limiter Configuration
const STORAGE_KEY = 'dnd_rate_limit_timestamps';
const WINDOW_MS = 60000; // 1 minute window
const MAX_REQUESTS = 10; // Max requests per window

/**
 * Checks if the current user is allowed to make an API request based on rate limits.
 * Persists timestamps to localStorage to prevent bypass via refresh.
 * @throws Error if rate limit is exceeded
 */
export const checkRateLimit = (): void => {
  const now = Date.now();
  
  // Retrieve existing timestamps from storage
  let timestamps: number[] = [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    timestamps = stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.warn("Failed to parse rate limit storage", e);
    timestamps = [];
  }
  
  // Filter out timestamps older than the window
  timestamps = timestamps.filter(t => now - t < WINDOW_MS);
  
  // Check limit
  if (timestamps.length >= MAX_REQUESTS) {
    const oldest = timestamps[0];
    const waitTime = Math.ceil((WINDOW_MS - (now - oldest)) / 1000);
    throw new Error(`Rate limit reached. Please wait ${waitTime} seconds before trying again.`);
  }
  
  // Record new request
  timestamps.push(now);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(timestamps));
};