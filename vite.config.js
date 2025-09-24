import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { copyFileSync } from 'fs'
import { resolve } from 'path'

// Advanced chunking to reduce initial bundle size and improve caching
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Plugin to copy .htaccess file after build
    {
      name: 'copy-htaccess',
      writeBundle() {
        try {
          copyFileSync(
            resolve(__dirname, 'public/.htaccess'),
            resolve(__dirname, 'dist/.htaccess')
          )
          console.log('✅ .htaccess file copied to dist folder')
        } catch (error) {
          console.warn('⚠️ Could not copy .htaccess file:', error.message)
        }
      }
    }
  ],
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
