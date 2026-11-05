import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { calendarVisionPlugin } from './services/calendarVision.mjs'

export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env };
  return {
    plugins: [react(), calendarVisionPlugin({ host: env.OLLAMA_HOST, model: env.CALENDAR_VISION_MODEL })],
    server: { port: 5173 },
  };
})
