import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  server: {
    // Handle client-side routing for development
    middlewareMode: false,
    historyApiFallback: true
  },
  build: {
    // Ensure proper asset handling
    assetsDir: 'assets',
    copyPublicDir: true
    // Removed manualChunks - was causing KaTeX loading issues in production
  },
  // Ensure proper module resolution for KaTeX
  optimizeDeps: {
    include: ['katex', 'react-katex']
  }
})
