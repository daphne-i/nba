import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
const REPO_NAME = 'nba';
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: mode === 'production' ? `/${REPO_NAME}/` : '/',
      server: {
        port: 5173,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      }
    };
});
