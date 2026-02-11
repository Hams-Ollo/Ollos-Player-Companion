import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_FILE_URI_PHB': JSON.stringify(env.VITE_GEMINI_FILE_URI_PHB || ''),
        'process.env.GEMINI_FILE_URI_DMG': JSON.stringify(env.VITE_GEMINI_FILE_URI_DMG || ''),
        'process.env.GEMINI_FILE_URI_MM': JSON.stringify(env.VITE_GEMINI_FILE_URI_MM || ''),
        'process.env.GEMINI_FILE_URI_BASIC': JSON.stringify(env.VITE_GEMINI_FILE_URI_BASIC || ''),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});