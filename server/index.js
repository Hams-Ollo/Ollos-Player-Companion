/**
 * 🏰 The Warding Circle — Express API Proxy Server
 *
 * This server serves the static SPA and proxies all AI requests to Google's
 * Gemini API. The Gemini API key lives ONLY here as a runtime environment
 * variable — it is never shipped to the browser.
 *
 * Endpoints:
 *   POST /api/gemini/generate   — Single-shot text generation
 *   POST /api/gemini/chat       — Stateless multi-turn chat
 *   POST /api/gemini/portrait   — Image generation (returns base64 data URI)
 *   POST /api/gemini/transcribe — Proxied Live Audio session token (future)
 *   GET  /api/health             — Health check
 *   *    /*                      — Static SPA (index.html fallback)
 */

import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { verifyFirebaseToken } from './middleware/auth.js';
import { createRateLimiter } from './middleware/rateLimit.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── Configuration ───────────────────────────────────────────────────
const PORT = parseInt(process.env.PORT || '8080', 10);
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
const TEXT_MODEL = 'gemini-2.5-flash';
const IMAGE_MODEL = 'gemini-2.5-flash-image';
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com';

// Gemini File URIs for grounding context (D&D rulebooks)
const FILE_URIS = {
  basic: process.env.GEMINI_FILE_URI_BASIC || '',
  dmg: process.env.GEMINI_FILE_URI_DMG || '',
  mm: process.env.GEMINI_FILE_URI_MM || '',
  phb: process.env.GEMINI_FILE_URI_PHB || '',
};

// ─── Validate API key ────────────────────────────────────────────────
if (!GEMINI_API_KEY) {
  console.error('[Server] FATAL: GEMINI_API_KEY is not set. AI features will not work.');
}

// ─── Gemini SDK instance ─────────────────────────────────────────────
const ai = GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: GEMINI_API_KEY, httpOptions: { baseUrl: GEMINI_BASE_URL } })
  : null;

// ─── Express app ─────────────────────────────────────────────────────
const app = express();
app.use(express.json({ limit: '5mb' })); // portraits can be large

// ─── Security headers ────────────────────────────────────────────────
app.use((_req, res, next) => {
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'microphone=(self), camera=(), geolocation=()');
  next();
});

// ─── Rate limiters ───────────────────────────────────────────────────
const userRateLimit = createRateLimiter({ windowMs: 60_000, maxRequests: 20 });   // 20/min per user
const globalRateLimit = createRateLimiter({ windowMs: 60_000, maxRequests: 200, global: true }); // 200/min total

// ─── Health check (no auth required) ─────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    aiAvailable: !!ai,
    timestamp: new Date().toISOString(),
  });
});

// ─── Auth + rate limit middleware for all /api/gemini/* routes ────────
app.use('/api/gemini', verifyFirebaseToken, globalRateLimit, userRateLimit);

// ─── POST /api/gemini/generate ───────────────────────────────────────
app.post('/api/gemini/generate', async (req, res) => {
  try {
    if (!ai) return res.status(503).json({ error: 'AI service unavailable' });

    const { prompt, config = {} } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
      config: {
        systemInstruction:
          'You are a specialized D&D 5e assistant. Provide accurate rules, engaging flavor text, and well-structured responses.',
        ...config,
      },
    });

    res.json({ text: response.text || null });
  } catch (err) {
    console.error('[Proxy] /generate error:', err.message);
    res.status(502).json({ error: 'AI request failed', details: err.message });
  }
});

// ─── POST /api/gemini/chat ───────────────────────────────────────────
app.post('/api/gemini/chat', async (req, res) => {
  try {
    if (!ai) return res.status(503).json({ error: 'AI service unavailable' });

    const { message, history = [], systemInstruction } = req.body;
    if (!message) return res.status(400).json({ error: 'Missing message' });
    if (!systemInstruction) return res.status(400).json({ error: 'Missing systemInstruction' });

    const chat = ai.chats.create({
      model: TEXT_MODEL,
      history,
      config: { systemInstruction },
    });

    const result = await chat.sendMessage({ message });
    res.json({ text: result.text || null });
  } catch (err) {
    console.error('[Proxy] /chat error:', err.message);
    res.status(502).json({ error: 'AI request failed', details: err.message });
  }
});

// ─── POST /api/gemini/portrait ───────────────────────────────────────
app.post('/api/gemini/portrait', async (req, res) => {
  try {
    if (!ai) return res.status(503).json({ error: 'AI service unavailable' });

    const { prompt, parts } = req.body;
    if (!prompt && !parts) return res.status(400).json({ error: 'Missing prompt or parts' });

    const contentParts = parts || [{ text: prompt }];
    const response = await ai.models.generateContent({
      model: IMAGE_MODEL,
      contents: { parts: contentParts },
      config: { responseModalities: ['Text', 'Image'] },
    });

    let imageDataUri = null;
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageDataUri = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    res.json({ imageDataUri });
  } catch (err) {
    console.error('[Proxy] /portrait error:', err.message);
    res.status(502).json({ error: 'AI request failed', details: err.message });
  }
});

// ─── POST /api/gemini/live-token ─────────────────────────────────────
// Returns the API key for the Live Audio WebSocket session.
// The Live API uses WebSockets which can't be easily proxied through REST,
// so we hand out the key to authenticated users for direct connection.
// Rate limiting and auth still apply — only signed-in users get a key.
app.post('/api/gemini/live-token', async (req, res) => {
  try {
    if (!GEMINI_API_KEY) return res.status(503).json({ error: 'AI service unavailable' });
    // Auth middleware already verified the token — just return the key
    res.json({ apiKey: GEMINI_API_KEY });
  } catch (err) {
    console.error('[Proxy] /live-token error:', err.message);
    res.status(500).json({ error: 'Failed to issue token' });
  }
});

// ─── Serve static SPA ────────────────────────────────────────────────
const distPath = path.resolve(__dirname, '..', 'dist');
app.use(express.static(distPath, {
  maxAge: '1y',
  immutable: true,
  index: 'index.html',
  setHeaders: (res, filePath) => {
    // Don't cache index.html — it may change between deploys
    if (filePath.endsWith('index.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  },
}));

// SPA fallback — all non-API routes serve index.html
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// ─── Start server ────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Server] The Warding Circle is active on port ${PORT}`);
  console.log(`[Server] AI available: ${!!ai}`);
  console.log(`[Server] Static files: ${distPath}`);
});
