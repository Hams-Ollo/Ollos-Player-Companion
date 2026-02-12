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

    // Build-time diagnostic — logs during vite build so we can see in Cloud Build logs
    const geminiKeyVal = getVar('GEMINI_API_KEY');
    console.log(`[vite-config] GEMINI_API_KEY: present=${!!geminiKeyVal}, length=${geminiKeyVal.length}, first8=${geminiKeyVal.substring(0, 8)}`);
    console.log(`[vite-config] Mode: ${mode}`);
    console.log(`[vite-config] loadEnv source: ${env['GEMINI_API_KEY'] ? '.env file' : 'not in .env'}`);
    console.log(`[vite-config] process.env source: ${process.env['GEMINI_API_KEY'] ? 'present' : 'not set'}`);

    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      preview: {
        port: 8080,
        host: '0.0.0.0',
      },
      plugins: [tailwindcss(), react()],
      define: {
        'process.env.API_KEY': JSON.stringify(getVar('GEMINI_API_KEY')),
        'process.env.GEMINI_API_KEY': JSON.stringify(getVar('GEMINI_API_KEY')),
        'process.env.VITE_FIREBASE_API_KEY': JSON.stringify(getVar('VITE_FIREBASE_API_KEY')),
        'process.env.VITE_FIREBASE_AUTH_DOMAIN': JSON.stringify(getVar('VITE_FIREBASE_AUTH_DOMAIN')),
        'process.env.VITE_FIREBASE_PROJECT_ID': JSON.stringify(getVar('VITE_FIREBASE_PROJECT_ID')),
        'process.env.VITE_FIREBASE_STORAGE_BUCKET': JSON.stringify(getVar('VITE_FIREBASE_STORAGE_BUCKET')),
        'process.env.VITE_FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(getVar('VITE_FIREBASE_MESSAGING_SENDER_ID')),
        'process.env.VITE_FIREBASE_APP_ID': JSON.stringify(getVar('VITE_FIREBASE_APP_ID')),
        'process.env.VITE_GEMINI_FILE_URI_BASIC': JSON.stringify(getVar('VITE_GEMINI_FILE_URI_BASIC')),
        'process.env.VITE_GEMINI_FILE_URI_DMG': JSON.stringify(getVar('VITE_GEMINI_FILE_URI_DMG')),
        'process.env.VITE_GEMINI_FILE_URI_MM': JSON.stringify(getVar('VITE_GEMINI_FILE_URI_MM')),
        'process.env.VITE_GEMINI_FILE_URI_PHB': JSON.stringify(getVar('VITE_GEMINI_FILE_URI_PHB')),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
