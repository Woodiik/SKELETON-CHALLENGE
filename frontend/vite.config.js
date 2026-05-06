import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwind from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

// Vite outputs the bundle into the Sails `assets/dist` folder.
// Sails serves it statically and the EJS layout reads `manifest.json`
// to pick up the right hashed file names per build.
export default defineConfig({
  // Sails mounts the dist folder at `/dist/` (see config/http.js), so all
  // generated asset URLs — including the dynamic-import preload paths Vite
  // bakes into the JS — need that prefix.
  base: '/dist/',
  plugins: [vue(), tailwind()],
  build: {
    outDir: '../assets/dist',
    emptyOutDir: true,
    manifest: true,
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./src/main.js', import.meta.url))
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api': 'http://localhost:1337'
    }
  }
});
