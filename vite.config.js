import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    watch: {
      usePolling: true,
      interval: 100
    },
    proxy: {
      '/api': {
        target: 'http://backend:8000', // use container name if in pod
        changeOrigin: true
      },
      '/static': {
        target: 'http://backend:8000',
        changeOrigin: true
      }
    }
  }
})
