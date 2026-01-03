import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base:'/Food_Delivery',
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@react-three/fiber',
      '@react-three/drei',
      'three',
    ],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three', '@react-three/fiber', '@react-three/drei'],
        },
      },
    },
  },
});
