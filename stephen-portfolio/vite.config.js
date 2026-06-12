import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime', 'scheduler'],
          'vendor-icons': ['react-icons'],
        },
      },
    },
  },
})
