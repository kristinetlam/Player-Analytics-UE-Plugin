import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Output directory for build files
    rollupOptions: {
      input: 'index.html', // Specify the entry HTML file if needed
    },
  },
})
