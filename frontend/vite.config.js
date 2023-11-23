// vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['cloudinary-react'],
  },
  server: {
    proxy: {
      '/search-places': 'http://localhost:4000' // Correct address & port for your backend server
    }
  }
});