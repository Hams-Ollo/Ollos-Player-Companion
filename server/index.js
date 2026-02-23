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
 *   POST /api/gemini/encounter  — AI-powered D&D encounter builder
 *   WS   /api/gemini/live       — Gemini Live Audio proxy (replaces raw key hand-out)
 *   GET  /api/health            — Health check
 *   *    /*                     — Static SPA (index.html fallback)
 */

import 'dotenv/config';
import { createServer } from 'http';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer } from 'ws';
import WebSocket from 'ws';
import { GoogleGenAI } from '@google/genai';
import { verifyFirebaseToken, verifyTokenDirect } from './middleware/auth.js';
import { createRateLimiter } from './middleware/rateLimit.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IS_PROD = process.env.NODE_ENV === 'production';

// ─── Configuration ────────────────────────────────────────────────────
const PORT = parseInt(process.env.PORT || '8080', 10);
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
const TEXT_MODEL = 'gemini-2.5-flash';
const IMAGE_MODEL = 'gemini-2.5-flash-image';
const GEMINI_LIVE_WS = 'wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent';

// Gemini File URIs for grounding context (D&D rulebooks — no VITE_ prefix, server-only)
const FILE_URIS = {
  basic: process.env.GEMINI_FILE_URI_BASIC || '',
  dmg:   process.env.GEMINI_FILE_URI_DMG   || '',
  mm:    process.env.GEMINI_FILE_URI_MM    || '',
  phb:   process.env.GEMINI_FILE_URI_PHB   || '',
};

// ─── Validate required env vars ───────────────────────────────────────
if (!GEMINI_API_KEY) {
  console.error('[Server] FATAL: GEMINI_API_KEY is not set. AI features will not work.');
}

// ─── Gemini SDK instance ──────────────────────────────────────────────
const ai = GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: GEMINI_API_KEY })
  : null;

// ─── Express app ──────────────────────────────────────────────────────
const app = express();
app.use(express.json({ limit: '5mb' }));

// ─── Security headers ─────────────────────────────────────────────────
app.use((_req, res, next) => {
  // Content-Security-Policy
  // 'unsafe-inline' for script-src is required until Vite production builds ship nonces.
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://identitytoolkit.googleapis.com wss://*.googleapis.com",
      "img-src 'self' data: blob: https:",
      "media-src 'self' blob:",
      "font-src 'self' data:",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ].join('; ')
  );
  // HSTS — 1 year, include subdomains, eligible for preload list
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  // Frame protection (belt-and-suspenders alongside CSP frame-ancestors)
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  // Prevent cross-origin opener attacks (e.g. tabnapping)
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  // camera=(self) allows the portrait selfie feature within same-origin pages only
  res.setHeader('Permissions-Policy', 'microphone=(self), camera=(self), geolocation=()');
  next();
});

// ─── Rate limiters ────────────────────────────────────────────────────
const userRateLimit   = createRateLimiter({ windowMs: 60_000, maxRequests: 20 });
const globalRateLimit = createRateLimiter({ windowMs: 60_000, maxRequests: 200, global: true });

// ─── Health check (no auth required) ─────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', aiAvailable: !!ai, timestamp: new Date().toISOString() });
});

// ─── Auth + rate limit middleware for all /api/gemini/* routes ────────
app.use('/api/gemini', verifyFirebaseToken, globalRateLimit, userRateLimit);

// ─── Input validation helpers ─────────────────────────────────────────
function validateString(val, maxLen, label) {
  if (typeof val !== 'string' || val.length === 0) return `Missing ${label}`;
  if (val.length > maxLen) return `${label} exceeds ${maxLen} character limit`;
  return null;
}

// ─── POST /api/gemini/generate ────────────────────────────────────────
app.post('/api/gemini/generate', async (req, res) => {
  try {
    if (!ai) return res.status(503).json({ error: 'AI service unavailable' });

    const { prompt, config = {} } = req.body;
    const err = validateString(prompt, 20_000, 'prompt');
    if (err) return res.status(400).json({ error: err });

    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
      config: {
        systemInstruction: 'You are a specialized D&D 5e assistant. Provide accurate rules, engaging flavor text, and well-structured responses.',
        ...config,
      },
    });

    res.json({ text: response.text || null });
  } catch (err) {
    console.error('[Proxy] /generate error:', err.message);
    res.status(502).json({ error: 'AI request failed', ...(IS_PROD ? {} : { details: err.message }) });
  }
});

// ─── POST /api/gemini/chat ────────────────────────────────────────────
app.post('/api/gemini/chat', async (req, res) => {
  try {
    if (!ai) return res.status(503).json({ error: 'AI service unavailable' });

    const { message, history = [], systemInstruction } = req.body;
    if (!message) return res.status(400).json({ error: 'Missing message' });
    if (!systemInstruction) return res.status(400).json({ error: 'Missing systemInstruction' });

    // Cap history to prevent unbounded token usage
    if (!Array.isArray(history)) return res.status(400).json({ error: 'history must be an array' });
    if (history.length > 50) return res.status(400).json({ error: 'history exceeds 50 message limit' });
    for (const turn of history) {
      if (typeof turn?.parts?.[0]?.text === 'string' && turn.parts[0].text.length > 10_000) {
        return res.status(400).json({ error: 'A history message exceeds 10,000 character limit' });
      }
    }

    const chat = ai.chats.create({ model: TEXT_MODEL, history, config: { systemInstruction } });
    const result = await chat.sendMessage({ message });
    res.json({ text: result.text || null });
  } catch (err) {
    console.error('[Proxy] /chat error:', err.message);
    res.status(502).json({ error: 'AI request failed', ...(IS_PROD ? {} : { details: err.message }) });
  }
});

// ─── POST /api/gemini/portrait ────────────────────────────────────────
app.post('/api/gemini/portrait', async (req, res) => {
  try {
    if (!ai) return res.status(503).json({ error: 'AI service unavailable' });

    const { prompt, parts } = req.body;
    if (!prompt && !parts) return res.status(400).json({ error: 'Missing prompt or parts' });

    // Validate parts array if provided
    if (parts !== undefined) {
      if (!Array.isArray(parts) || parts.length > 2) {
        return res.status(400).json({ error: 'parts must be an array of at most 2 items' });
      }
      for (const p of parts) {
        // inlineData (image) parts: cap data URI at ~5 MB base64
        if (p?.inlineData?.data && p.inlineData.data.length > 7_000_000) {
          return res.status(400).json({ error: 'Image data exceeds 5 MB limit' });
        }
      }
    }

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
    res.status(502).json({ error: 'AI request failed', ...(IS_PROD ? {} : { details: err.message }) });
  }
});

// ─── POST /api/gemini/encounter ──────────────────────────────────────
// AI-powered encounter generator grounded in the Monster Manual PDF.
app.post('/api/gemini/encounter', async (req, res) => {
  try {
    if (!ai) return res.status(503).json({ error: 'AI service unavailable' });

    const { scenarioDescription, partyLevels, partyClasses, difficulty, environment } = req.body;

    // Input validation
    const descErr = validateString(scenarioDescription, 2_000, 'scenarioDescription');
    if (descErr) return res.status(400).json({ error: descErr });
    if (!Array.isArray(partyLevels) || partyLevels.length === 0 || partyLevels.length > 12) {
      return res.status(400).json({ error: 'partyLevels must be an array of 1–12 levels' });
    }
    if (partyClasses !== undefined && (!Array.isArray(partyClasses) || partyClasses.length > 12)) {
      return res.status(400).json({ error: 'partyClasses must be an array of at most 12 items' });
    }
    if (environment !== undefined) {
      const envErr = validateString(environment, 200, 'environment');
      if (envErr) return res.status(400).json({ error: envErr });
    }

    const avgLevel = Math.round(partyLevels.reduce((a, b) => a + b, 0) / partyLevels.length);
    const partySize = partyLevels.length;

    const XP_THRESHOLDS = {
      1:  { easy: 25,   medium: 50,   hard: 75,   deadly: 100  },
      2:  { easy: 50,   medium: 100,  hard: 150,  deadly: 200  },
      3:  { easy: 75,   medium: 150,  hard: 225,  deadly: 400  },
      4:  { easy: 125,  medium: 250,  hard: 375,  deadly: 500  },
      5:  { easy: 250,  medium: 500,  hard: 750,  deadly: 1100 },
      6:  { easy: 300,  medium: 600,  hard: 900,  deadly: 1400 },
      7:  { easy: 350,  medium: 750,  hard: 1100, deadly: 1700 },
      8:  { easy: 450,  medium: 900,  hard: 1400, deadly: 2100 },
      9:  { easy: 550,  medium: 1100, hard: 1600, deadly: 2400 },
      10: { easy: 600,  medium: 1200, hard: 1900, deadly: 2800 },
    };
    const levelThresholds = XP_THRESHOLDS[Math.min(avgLevel, 10)] || XP_THRESHOLDS[10];
    const totalXPBudget = (levelThresholds[difficulty] || levelThresholds.medium) * partySize;

    const systemPrompt = `You are an expert D&D 5e Dungeon Master and encounter designer.
You have access to the Monster Manual PDF. Use it to produce ACCURATE stat blocks matching official MM entries.
Always return valid JSON matching the exact schema provided. Do NOT include markdown fences in your response.`;

    const userPrompt = `Design a D&D 5e combat encounter with the following parameters:

PARTY:
- Size: ${partySize} players
- Average Level: ${avgLevel}
- Classes: ${(partyClasses || []).join(', ') || 'Mixed'}
- Target Difficulty: ${difficulty}
- XP Budget: ~${totalXPBudget} XP (adjusted)

SCENARIO: ${scenarioDescription}
${environment ? `ENVIRONMENT: ${environment}` : ''}

Using the Monster Manual, return a JSON object with this exact structure:
{
  "name": "Short encounter name",
  "narrativeHook": "2-3 sentence scene-setting description the DM reads aloud",
  "creatures": [
    {
      "name": "Creature name (exact MM name)",
      "count": 1,
      "tacticsNotes": "1-2 sentences on how this creature fights in this specific encounter",
      "statBlock": {
        "cr": "1", "size": "Medium", "creatureType": "Humanoid (goblinoid)",
        "alignment": "Neutral Evil", "hp": 7, "ac": 15, "speed": "30 ft.", "xp": 200,
        "abilityScores": { "STR": 10, "DEX": 14, "CON": 10, "INT": 10, "WIS": 8, "CHA": 8 },
        "savingThrows": {}, "skillBonuses": [{ "name": "Stealth", "modifier": 6 }],
        "senses": "Darkvision 60 ft., Passive Perception 9", "languages": "Common, Goblin",
        "damageImmunities": [], "conditionImmunities": [],
        "traits": [{ "name": "Nimble Escape", "description": "The goblin can take the Disengage or Hide action as a bonus action." }],
        "attacks": [{ "name": "Scimitar", "attackBonus": 4, "reach": "5 ft.", "targets": "one target", "damageExpression": "1d6+2", "damageType": "Slashing", "additionalEffects": "" }]
      }
    }
  ],
  "terrainFeatures": ["Collapsed stone pillars provide half cover"],
  "difficultyRating": "${difficulty}", "totalXP": 200, "adjustedXP": 300
}

Requirements: include 2–4 creature types; all stat block values MUST match official Monster Manual.`;

    const contentParts = [];
    if (FILE_URIS.mm) {
      contentParts.push({ fileData: { mimeType: 'application/pdf', fileUri: FILE_URIS.mm } });
    }
    contentParts.push({ text: userPrompt });

    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: [{ parts: contentParts }],
      config: { systemInstruction: systemPrompt, responseMimeType: 'application/json', temperature: 0.7 },
    });

    let result = null;
    try {
      result = JSON.parse(response.text || '{}');
    } catch (parseErr) {
      console.error('[Proxy] /encounter JSON parse error:', parseErr.message);
      const match = (response.text || '').match(/\{[\s\S]*\}/);
      if (match) {
        try { result = JSON.parse(match[0]); } catch {}
      }
    }

    if (!result) return res.status(502).json({ error: 'AI returned unparseable response' });

    res.json(result);
  } catch (err) {
    console.error('[Proxy] /encounter error:', err.message);
    res.status(502).json({ error: 'AI request failed', ...(IS_PROD ? {} : { details: err.message }) });
  }
});

// ─── Serve static SPA ─────────────────────────────────────────────────
const distPath = path.resolve(__dirname, '..', 'dist');
app.use(express.static(distPath, {
  maxAge: '1y',
  immutable: true,
  index: 'index.html',
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('index.html')) res.setHeader('Cache-Control', 'no-cache');
  },
}));

// SPA fallback
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// ─── HTTP server (needed to intercept WS upgrades) ────────────────────
const httpServer = createServer(app);

// ─── WebSocket proxy — Gemini Live Audio ──────────────────────────────
// Client connects: ws(s)://<origin>/api/gemini/live?token=<firebase-id-token>
// Server verifies the token, then opens a proxied WS to Gemini Live API
// with the real GEMINI_API_KEY — the key never reaches the browser.
const wss = new WebSocketServer({ noServer: true });

httpServer.on('upgrade', async (request, socket, head) => {
  const url = new URL(request.url, `http://${request.headers.host}`);

  if (url.pathname !== '/api/gemini/live') {
    socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
    socket.destroy();
    return;
  }

  const idToken = url.searchParams.get('token');
  if (!idToken) {
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    socket.destroy();
    return;
  }

  // Enforce a 5s timeout for auth — prevents socket hang-open attacks
  const authTimeout = setTimeout(() => {
    socket.write('HTTP/1.1 408 Request Timeout\r\n\r\n');
    socket.destroy();
  }, 5_000);

  try {
    await verifyTokenDirect(idToken);
    clearTimeout(authTimeout);
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws);
    });
  } catch {
    clearTimeout(authTimeout);
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    socket.destroy();
  }
});

wss.on('connection', (clientWs) => {
  if (!GEMINI_API_KEY) {
    clientWs.close(1011, 'AI service unavailable');
    return;
  }

  // Open authenticated connection to Gemini Live API server-side
  const geminiWs = new WebSocket(`${GEMINI_LIVE_WS}?key=${GEMINI_API_KEY}`);

  geminiWs.on('open', () => {
    // Pipe client → Gemini
    clientWs.on('message', (data) => {
      if (geminiWs.readyState === WebSocket.OPEN) geminiWs.send(data);
    });
  });

  // Pipe Gemini → client
  geminiWs.on('message', (data) => {
    if (clientWs.readyState === WebSocket.OPEN) clientWs.send(data);
  });

  geminiWs.on('close', (code, reason) => clientWs.close(code, reason));
  geminiWs.on('error', (err) => {
    console.error('[WS Proxy] Gemini socket error:', err.message);
    if (clientWs.readyState === WebSocket.OPEN) clientWs.close(1011, 'Upstream error');
  });

  clientWs.on('close', () => {
    if (geminiWs.readyState === WebSocket.OPEN || geminiWs.readyState === WebSocket.CONNECTING) {
      geminiWs.close();
    }
  });
  clientWs.on('error', (err) => {
    console.error('[WS Proxy] Client socket error:', err.message);
    if (geminiWs.readyState === WebSocket.OPEN) geminiWs.close();
  });
});

// ─── Start server ─────────────────────────────────────────────────────
httpServer.listen(PORT, '0.0.0.0', () => {
  if (!IS_PROD) {
    console.log(`[Server] The Warding Circle is active on port ${PORT}`);
    console.log(`[Server] AI available: ${!!ai}`);
    console.log(`[Server] Static files: ${distPath}`);
  }
});

