import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      // Optimize babel transforms
      babel: {
        compact: true,
      },
    }),
  ],
  
  // Ensure public directory is properly set for Tauri
  publicDir: 'public',
  
  assetsInclude: ['**/*.mp3', '**/*.MP3', '**/*.wav', '**/*.ogg', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.svg', '**/*.webp'],
  
  // Build optimizations
  build: {
    // Target modern browsers for smaller bundle
    target: 'esnext',
    
    // Minification options
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'],
      },
      format: {
        comments: false, // Remove comments
      },
    },
    
    // Chunk splitting strategy
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // React core
          'react-vendor': ['react', 'react-dom'],
          // UI libraries
          'ui-vendor': ['framer-motion', 'lucide-react', 'recharts'],
          // State management
          'state-vendor': ['zustand'],
          // Utilities
          'utils-vendor': ['nanoid', 'date-fns', 'clsx'],
        },
        // Naming pattern for chunks
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    
    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
    
    // Source maps for production debugging (optional)
    sourcemap: false,
    
    // Report compressed size
    reportCompressedSize: true,
    
    // CSS code splitting
    cssCodeSplit: true,
  },
  
  // Development optimizations
  server: {
    // Enable HMR
    hmr: true,
    // Port
    port: 5174,
    // Open browser automatically
    open: false,
    // CORS
    cors: true,
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'zustand',
      'framer-motion',
      'lucide-react',
      'recharts',
      'nanoid',
      'date-fns',
      'clsx',
    ],
    // Pre-bundle dependencies for faster dev server startup
    esbuildOptions: {
      target: 'esnext',
    },
  },
  
  // Performance
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
    // Drop console in production
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  },
  
  // Preview server config
  preview: {
    port: 4173,
    strictPort: true,
  },
})