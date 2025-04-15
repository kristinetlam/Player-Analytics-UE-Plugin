import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

console.log('Current working directory:', process.cwd());

export default defineConfig({
  root: '.', // Ensure Vite knows where to look
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: 'index.html',
    },
    minify: 'terser',
    terserOptions: {
      keep_fnames: true // <--- preserve function names like DashboardLayoutBasic
    }
  },
});
