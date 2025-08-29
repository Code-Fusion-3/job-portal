import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Advanced chunking to reduce initial bundle size and improve caching
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Keep React and React DOM together to avoid context issues
            if (id.includes('react') || id.includes('react-dom')) return 'vendor-react'
            if (id.includes('react-router')) return 'vendor-router'
            if (id.includes('framer-motion')) return 'vendor-motion'
            if (id.includes('gsap')) return 'vendor-gsap'
            return 'vendor-common'
          }
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    },
    chunkSizeWarningLimit: 900
  }
})
