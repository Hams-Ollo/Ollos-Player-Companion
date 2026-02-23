import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Fix for __dirname being unavailable in ESM environments
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');

    // Helper: prefer .env file value, fall back to OS env var (Docker/Cloud Run builds)
    const getVar = (key: string) => env[key] || process.env[key] || '';

    return {
      server: {
        port: 3000,
        host: 'localhost', // bind to loopback only in dev; was '0.0.0.0' which exposed to LAN
        // Proxy API calls to the Express server during development
        proxy: {
          '/api': {
            target: 'http://localhost:3001',
            changeOrigin: true,
            ws: true, // forward WebSocket upgrades (required for /api/gemini/live)
          },
        },
      },
      preview: {
        port: 8080,
        host: '0.0.0.0',
      },
      plugins: [tailwindcss(), react()],
      define: {
        // NOTE: GEMINI_API_KEY is intentionally NOT included here.
        // It lives only on the server as a runtime environment variable.
        // All AI calls go through /api/gemini/* proxy routes.
        'process.env.VITE_FIREBASE_API_KEY': JSON.stringify(getVar('VITE_FIREBASE_API_KEY')),
        'process.env.VITE_FIREBASE_AUTH_DOMAIN': JSON.stringify(getVar('VITE_FIREBASE_AUTH_DOMAIN')),
        'process.env.VITE_FIREBASE_PROJECT_ID': JSON.stringify(getVar('VITE_FIREBASE_PROJECT_ID')),
        'process.env.VITE_FIREBASE_STORAGE_BUCKET': JSON.stringify(getVar('VITE_FIREBASE_STORAGE_BUCKET')),
        'process.env.VITE_FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(getVar('VITE_FIREBASE_MESSAGING_SENDER_ID')),
        'process.env.VITE_FIREBASE_APP_ID': JSON.stringify(getVar('VITE_FIREBASE_APP_ID')),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
