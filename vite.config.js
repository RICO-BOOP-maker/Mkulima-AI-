import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindCSS from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindCSS(),
  ],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: true,
      mangle: true,
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'ui': ['lucide-react', 'motion'],
          'ai': ['@google/genai']
        }
      }
    }
  },
  server: {
    port: 5173,
    strictPort: false,
    cors: true
  },
  envPrefix: 'VITE_'
})
