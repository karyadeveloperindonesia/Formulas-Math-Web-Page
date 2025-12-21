import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, mkdirSync } from 'fs'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-katex-fonts',
      apply: 'build',
      generateBundle() {
        // KaTeX fonts akan otomatis di-bundle oleh node_modules resolve
      }
    }
  ],
  publicDir: 'public',
  build: {
    // Ensure proper asset handling
    assetsDir: 'assets',
    copyPublicDir: true,
    rollupOptions: {
      output: {
        // KaTeX fonts akan included dalam vendor bundle
        manualChunks: undefined
      }
    }
  },
  // Ensure proper module resolution for KaTeX
  optimizeDeps: {
    include: ['katex', 'react-katex']
  }
})
