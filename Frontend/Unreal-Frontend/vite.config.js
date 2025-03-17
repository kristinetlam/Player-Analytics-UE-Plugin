import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  root: '.', // This ensures that Vite looks for index.html in the root folder
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: 'index.html', // Make sure Vite uses the correct HTML entry file
    },
  },
})
