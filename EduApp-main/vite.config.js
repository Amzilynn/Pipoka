import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { authPlugin } from './services/auth.mjs'
import { calendarVisionPlugin } from './services/calendarVision.mjs'

export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env };
  return {
    plugins: [react(), authPlugin({ databasePath: env.AUTH_DATABASE_PATH, origin: env.AUTH_ORIGIN, secureCookies: env.AUTH_SECURE_COOKIES === 'true' || env.AUTH_ORIGIN?.startsWith('https://') }), calendarVisionPlugin({ host: env.OLLAMA_HOST, model: env.CALENDAR_VISION_MODEL })],
    server: { port: 5173 },
  };
})
