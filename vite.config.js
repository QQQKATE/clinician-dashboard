import { defineConfig } from 'vite'

export default defineConfig({
  server: { port: 5173 },
  base: process.env.NODE_ENV === 'production' ? '/clinician-dashboard/' : '/'
})
